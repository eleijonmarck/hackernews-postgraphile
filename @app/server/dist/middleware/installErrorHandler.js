"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const isDev = process.env.NODE_ENV === "development";
function parseError(error) {
    /*
     * Because an error may contain confidential information or information that
     * might help attackers, by default we don't output the error message at all.
     * You should override this for specific classes of errors below.
     */
    // TODO: process certain errors
    const code = error["statusCode"] || error["status"] || error["code"];
    const codeAsFloat = parseInt(code, 10);
    const httpCode = isFinite(codeAsFloat) && codeAsFloat >= 400 && codeAsFloat < 600
        ? codeAsFloat
        : 500;
    return {
        message: "An unknown error occurred",
        status: httpCode,
    };
}
let errorPageTemplate;
function getErrorPage({ message }) {
    if (!errorPageTemplate || isDev) {
        errorPageTemplate = lodash_1.template(fs.readFileSync(path_1.resolve(__dirname, "../../error.html"), "utf8"));
    }
    return errorPageTemplate({ message });
}
function default_1(app) {
    const errorRequestHandler = (error, _req, res, next) => {
        try {
            const parsedError = parseError(error);
            const errorMessageString = `ERROR: ${parsedError.message}`;
            if (res.headersSent) {
                console.error(errorMessageString);
                res.end();
                return;
            }
            res.status(parsedError.status);
            res.format({
                "text/plain": function () {
                    res.send(errorMessageString);
                },
                "text/html": function () {
                    res.send(getErrorPage(parsedError));
                },
                "application/json": function () {
                    res.send({ errors: [{ message: errorMessageString }] });
                },
                default: function () {
                    // log the request and respond with 406
                    res.status(406).send("Not Acceptable");
                },
            });
        }
        catch (e) {
            next(e);
        }
    };
    app.use(errorRequestHandler);
}
exports.default = default_1;
//# sourceMappingURL=installErrorHandler.js.map