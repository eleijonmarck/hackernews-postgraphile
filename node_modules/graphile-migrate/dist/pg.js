"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pg_connection_string_1 = require("pg-connection-string");
async function withClient(connectionString, parsedSettings, callback) {
    const { database } = pg_connection_string_1.parse(connectionString);
    if (!database) {
        throw new Error("Connection string does not specify a database");
    }
    const pgPool = new pg_1.Pool({ connectionString });
    pgPool.on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error("An error occurred in the PgPool", err);
        process.exit(1);
    });
    try {
        const pgClient = await pgPool.connect();
        try {
            if (parsedSettings.pgSettings) {
                const sqlFragments = [];
                const sqlValues = [];
                for (const [key, value] of Object.entries(parsedSettings.pgSettings)) {
                    sqlValues.push(key, value);
                    sqlFragments.push(`pg_catalog.set_config($${sqlValues.length - 1}::text, $${sqlValues.length}::text, false)`);
                }
                if (sqlFragments.length) {
                    await pgClient.query({
                        text: `select ${sqlFragments.join(", ")}`,
                        values: sqlValues,
                    });
                }
            }
            const context = {
                database,
            };
            return await callback(pgClient, context);
        }
        finally {
            await Promise.resolve(pgClient.release());
        }
    }
    finally {
        await pgPool.end();
    }
}
exports.withClient = withClient;
async function withTransaction(pgClient, callback) {
    await pgClient.query("begin");
    try {
        const result = await callback();
        await pgClient.query("commit");
        return result;
    }
    catch (e) {
        await pgClient.query("rollback");
        throw e;
    }
}
exports.withTransaction = withTransaction;
function escapeIdentifier(str) {
    return '"' + str.replace(/"/g, '""') + '"';
}
exports.escapeIdentifier = escapeIdentifier;
//# sourceMappingURL=pg.js.map