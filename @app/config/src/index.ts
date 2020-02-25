// @ts-ignore
const packageJson = require("../../../package.json");

// TODO: customise this with your own settings!

export const fromEmail =
  '"PostGraphile Starter" <no-reply@examples.graphile.org>';
export const awsRegion = "eu-west-1";
export const projectName = packageJson.name;
export const companyName = "eleijonmarck"; // For copyright ownership
export const emailLegalText =
  // Envvar here so we can override on the demo website
  process.env.LEGAL_TEXT || "<Insert legal email footer text here >";
