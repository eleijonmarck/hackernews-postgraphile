"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const middleware = tslib_1.__importStar(require("./middleware"));
const shutdownActions_1 = require("./shutdownActions");
const utils_1 = require("./utils");
// Server may not always be supplied, e.g. where mounting on a sub-route
function getHttpServer(app) {
    return app.get("httpServer");
}
exports.getHttpServer = getHttpServer;
function getShutdownActions(app) {
    return app.get("shutdownActions");
}
exports.getShutdownActions = getShutdownActions;
function getWebsocketMiddlewares(app) {
    return app.get("websocketMiddlewares");
}
exports.getWebsocketMiddlewares = getWebsocketMiddlewares;
async function makeApp({ httpServer, } = {}) {
    utils_1.sanitizeEnv();
    const isTest = process.env.NODE_ENV === "test";
    const isDev = process.env.NODE_ENV === "development";
    const shutdownActions = shutdownActions_1.makeShutdownActions();
    if (isDev) {
        shutdownActions.push(() => {
            require("inspector").close();
        });
    }
    /*
     * Our Express server
     */
    const app = express_1.default();
    /*
     * Getting access to the HTTP server directly means that we can do things
     * with websockets if we need to (e.g. GraphQL subscriptions).
     */
    app.set("httpServer", httpServer);
    /*
     * For a clean nodemon shutdown, we need to close all our sockets otherwise
     * we might not come up cleanly again (inside nodemon).
     */
    app.set("shutdownActions", shutdownActions);
    /*
     * When we're using websockets, we may want them to have access to
     * sessions/etc for authentication.
     */
    const websocketMiddlewares = [];
    app.set("websocketMiddlewares", websocketMiddlewares);
    /*
     * Middleware is installed from the /server/middleware directory. These
     * helpers may augment the express app with new settings and/or install
     * express middleware. These helpers may be asynchronous, but they should
     * operate very rapidly to enable quick as possible server startup.
     */
    await middleware.installDatabasePools(app);
    await middleware.installHelmet(app);
    await middleware.installSession(app);
    await middleware.installPassport(app);
    await middleware.installLogging(app);
    // These are our assets: images/etc; served out of the /@app/server/public folder (if present)
    await middleware.installSharedStatic(app);
    if (isTest || isDev) {
        await middleware.installCypressServerCommand(app);
    }
    await middleware.installPostGraphile(app);
    await middleware.installSSR(app);
    /*
     * Error handling middleware
     */
    await middleware.installErrorHandler(app);
    return app;
}
exports.makeApp = makeApp;
//# sourceMappingURL=app.js.map