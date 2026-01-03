# Campaign Management Project

A mono-repo containing the backend API (`Campaign-module`) and frontend (`Campaign-ui`) for the Campaign Management system.

## Quick Overview

- Backend: `Campaign-module` (Express.js, services, models, routes)
- Frontend: `Campaign-ui` (Next.js app under `src/`)

## Repo structure
```
Campaign-module/
Campaign-ui/
```

## Quick start

1. Install dependencies in each package:

```bash
# from repo root
cd Campaign-module && npm install
cd ../Campaign-ui && npm install
```

2. Run locally per package (see each package `package.json` scripts):

```bash
# backend
cd Campaign-module && npm start

# frontend
cd Campaign-ui && npm run dev
```

## Important: history rewrite performed

Large binaries (node and Next.js SWC binary under `node_modules`) were previously committed and exceeded GitHub's 100 MB limit. To fix that, the repository history was rewritten to remove the offending files and a cleaned `main` branch was force-pushed to the remote.

**If you have a local clone:**
- Recommended: re-clone the repository:

```bash
git clone https://github.com/ultimate-knight/Campaign-Management-Project.git
```

- Or (destructive) reset your current clone to match the cleaned remote:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

If you had local branches or uncommitted changes, backup those before resetting.

## Notes & recommendations

- `node_modules/` is now included in `.gitignore` for both `Campaign-module` and `Campaign-ui`; do not commit dependencies.
- If you actually need large binaries tracked, use Git LFS. I can help set up `git lfs` for selected files if you want.

---

Maintainers: ultimate-knight / maaz
