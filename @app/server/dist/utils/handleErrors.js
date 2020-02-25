"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const ERROR_PROPERTIES_TO_EXPOSE = isDev || isTest
    ? [
        "code",
        "severity",
        "detail",
        "hint",
        "positon",
        "internalPosition",
        "internalQuery",
        "where",
        "schema",
        "table",
        "column",
        "dataType",
        "constraint",
    ]
    : ["code"];
// This would be better as a macro...
const pluck = (err) => {
    return ERROR_PROPERTIES_TO_EXPOSE.reduce((memo, key) => {
        const value = key === "code"
            ? // err.errcode is equivalent to err.code; replace it
                err.code || err.errcode
            : err[key];
        if (value != null) {
            memo[key] = value;
        }
        return memo;
    }, {});
};
/**
 * This map allows you to override the error object output to users from
 * database errors.
 *
 * See `docs/error_codes.md` for a list of error codes we use internally.
 *
 * See https://www.postgresql.org/docs/current/errcodes-appendix.html for a
 * list of error codes that PostgreSQL produces.
 */
exports.ERROR_MESSAGE_OVERRIDES = {
    "42501": err => ({
        ...pluck(err),
        message: "Permission denied (by RLS)",
    }),
    "23505": err => ({
        ...pluck(err),
        message: "Conflict occurred",
        fields: conflictFieldsFromError(err),
        code: "NUNIQ",
    }),
};
function conflictFieldsFromError(err) {
    const { table, constraint } = err;
    // TODO: extract a list of constraints from the DB
    if (constraint && table) {
        const PREFIX = `${table}_`;
        const SUFFIX = `_key`;
        if (constraint.startsWith(PREFIX) && constraint.endsWith(SUFFIX)) {
            const maybeColumnNames = constraint.substr(PREFIX.length, constraint.length - PREFIX.length - SUFFIX.length);
            return [lodash_1.camelCase(maybeColumnNames)];
        }
    }
    return undefined;
}
function handleErrors(errors) {
    return errors.map(error => {
        const { message: rawMessage, locations, path, originalError } = error;
        const code = originalError ? originalError["code"] : null;
        const localPluck = exports.ERROR_MESSAGE_OVERRIDES[code] || pluck;
        const exception = localPluck(originalError || error);
        return {
            message: exception.message || rawMessage,
            locations,
            path,
            extensions: {
                exception,
            },
        };
    });
}
exports.default = handleErrors;
//# sourceMappingURL=handleErrors.js.map