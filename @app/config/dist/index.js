"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const packageJson = require("../../../package.json");
// TODO: customise this with your own settings!
exports.fromEmail = '"PostGraphile Starter" <no-reply@examples.graphile.org>';
exports.awsRegion = "eu-west-1";
exports.projectName = packageJson.name;
exports.companyName = "eleijonmarck"; // For copyright ownership
exports.emailLegalText = 
// Envvar here so we can override on the demo website
process.env.LEGAL_TEXT || "<Insert legal email footer text here >";
//# sourceMappingURL=index.js.map