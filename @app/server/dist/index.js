#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable no-console */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const http_1 = require("http");
const app_1 = require("./app");
// @ts-ignore
const packageJson = require("../../../package.json");
async function main() {
    // Create our HTTP server
    const httpServer = http_1.createServer();
    // Make our application (loading all the middleware, etc)
    const app = await app_1.makeApp({ httpServer });
    // Add our application to our HTTP server
    httpServer.addListener("request", app);
    // And finally, we open the listen port
    const PORT = parseInt(process.env.PORT || "", 10) || 3000;
    httpServer.listen(PORT, () => {
        const address = httpServer.address();
        const actualPort = typeof address === "string"
            ? address
            : address && address.port
                ? String(address.port)
                : String(PORT);
        console.log();
        console.log(chalk_1.default.green(`${chalk_1.default.bold(packageJson.name)} listening on port ${chalk_1.default.bold(actualPort)}`));
        console.log();
        console.log(`  Site:     ${chalk_1.default.bold.underline(`http://localhost:${actualPort}`)}`);
        console.log(`  GraphiQL: ${chalk_1.default.bold.underline(`http://localhost:${actualPort}/graphiql`)}`);
        console.log();
    });
    // Nodemon SIGUSR2 handling
    const shutdownActions = app_1.getShutdownActions(app);
    shutdownActions.push(() => {
        httpServer.close();
    });
}
main().catch(e => {
    console.error("Fatal error occurred starting server!");
    console.error(e);
    process.exit(101);
});
//# sourceMappingURL=index.js.map