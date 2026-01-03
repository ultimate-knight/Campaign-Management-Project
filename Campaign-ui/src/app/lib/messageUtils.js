export const replaceTemplateVars = (template, userData) => {
  let msg = template;
  Object.keys(userData).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    msg = msg.replace(regex, userData[key] || "");
  });
  return msg;
};
