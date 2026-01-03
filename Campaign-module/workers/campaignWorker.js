const Queue = require('bull');
const mongoose = require('mongoose');
const Report = require('../models/reports');   
const Campaign = require('../models/campaign'); 

// Redis + MongoDB Connection
const redisConfig = { redis: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 } };
const campaignQueue = new Queue('campaignQueue', redisConfig);


// Safe query parser
const parseQuerySafe = (q) => {
  if (!q) return {};
  try {
    const parsed = typeof q === 'string' ? JSON.parse(q.replace(/'/g, '"')) : q;
    if (parsed.branch && mongoose.Types.ObjectId.isValid(parsed.branch)) parsed.branch = new mongoose.Types.ObjectId(parsed.branch);
    return parsed;
  } catch { throw new Error('Invalid query');  }
};

//  Sequential Insert Queue
class SequentialInsertQueue {
  constructor() { this.q = []; this.running = false; }
  enqueue(campaignId, batch, idx) {
    return new Promise((res, rej) => { this.q.push({ campaignId, batch, idx, res, rej }); this.next(); });
  }
  async next() {
    if (this.running || !this.q.length) return;
    this.running = true;
    const { campaignId, batch, idx, res, rej } = this.q.shift();
    try {
      if (batch.length) {
        await Campaign.updateOne({ _id: campaignId }, { $push: { result: { $each: batch } }, $inc: { 'metaData.updatedRecords': batch.length } });
        console.log(`[Reader-${idx}] Inserted ${batch.length}`);
      }
      res();
    } catch (e) { console.error(`[Reader-${idx}] Insert failed:`, e); rej(e); }
    finally { this.running = false; this.next(); }
  }
}

// Main Worker
campaignQueue.process('populateResults', 4, async ({ data: { campaignId, query } }) => {
  console.log(`Campaign ${campaignId} started`);
  const fail = (msg) => Campaign.findByIdAndUpdate(campaignId, { $set: { 'metaData.processingStatus': 'failed', 'metaData.processingError': msg } });

  try {
    let filter = parseQuerySafe(query);
    await Campaign.findByIdAndUpdate(campaignId, { $set: { result: [], 'metaData': { processingStatus: 'processing', updatedRecords: 0, processingError: '' } } });

    const total = await Report.countDocuments(filter);
    if (!total) return Campaign.findByIdAndUpdate(campaignId, { $set: { 'metaData.processingStatus': 'done' } });

    // Partition docs by ranges
    const step = Math.ceil(total / 10);
    const bounds = await Promise.all([...Array(10).keys()].map(i => Report.find(filter).sort({ _id: 1 }).skip((i + 1) * step).limit(1).select('_id')));
    const ranges = bounds.flat().reduce((acc, b, i, arr) => {
      const last = arr[i - 1]?._id;
      acc.push({ ...filter, ...(last ? { _id: { $gt: last, $lte: b._id } } : { _id: { $lte: b._id } }) });
      return acc;
    }, []);
    ranges.push({ ...filter, ...(bounds.at(-1)?.[0]?._id ? { _id: { $gt: bounds.at(-1)[0]._id } } : {}) });

    console.log(`${total} docs split into ${ranges.length} ranges`);

    const insertQueue = new SequentialInsertQueue();
    await Promise.all(ranges.map(async (range, idx) => {
      const cursor = Report.find(range).lean().cursor();
      let batch = [];
      for await (const r of cursor) {
        batch.push({ userData: { referenceId: r._id, name: r.PatientName || '', email: r.Email || '', mobileNo: r.MobileNo || '', gender: r.Gender || '', nationality: r.Nationality || '' }, communicationStatus: 'new' });
        if (batch.length >= 1000) { await insertQueue.enqueue(campaignId, batch, idx); batch = []; }
      }
      if (batch.length) await insertQueue.enqueue(campaignId, batch, idx);
    }));

    await Campaign.findByIdAndUpdate(campaignId, { $set: { 'metaData.processingStatus': 'done' } });
    console.log(`Campaign ${campaignId} done`);
  } catch (e) { console.error(`Campaign ${campaignId} error:`, e); await fail(e.message); throw e; }
});

campaignQueue.on('error', (err) => console.error('Queue error:', err));
console.log('📡 Campaign worker ready');
