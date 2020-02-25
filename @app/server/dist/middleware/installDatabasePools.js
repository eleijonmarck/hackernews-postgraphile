"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const app_1 = require("../app");
function getRootPgPool(app) {
    return app.get("rootPgPool");
}
exports.getRootPgPool = getRootPgPool;
function getAuthPgPool(app) {
    return app.get("authPgPool");
}
exports.getAuthPgPool = getAuthPgPool;
/**
 * When a PoolClient omits an 'error' event that cannot be caught by a promise
 * chain (e.g. when the PostgreSQL server terminates the link but the client
 * isn't actively being used) the error is raised via the Pool. In Node.js if
 * an 'error' event is raised and it isn't handled, the entire process exits.
 * This NOOP handler avoids this occurring on our pools.
 *
 * TODO: log this to an error reporting service.
 */
function swallowPoolError(_error) {
    /* noop */
}
exports.default = (app) => {
    // This pool runs as the database owner, so it can do anything.
    const rootPgPool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    rootPgPool.on("error", swallowPoolError);
    app.set("rootPgPool", rootPgPool);
    // This pool runs as the unprivileged user, it's what PostGraphile uses.
    const authPgPool = new pg_1.Pool({
        connectionString: process.env.AUTH_DATABASE_URL,
    });
    authPgPool.on("error", swallowPoolError);
    app.set("authPgPool", authPgPool);
    const shutdownActions = app_1.getShutdownActions(app);
    shutdownActions.push(() => {
        rootPgPool.end();
    });
    shutdownActions.push(() => {
        authPgPool.end();
    });
};
//# sourceMappingURL=installDatabasePools.js.map