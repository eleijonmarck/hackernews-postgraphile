"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// TODO: fix to 'import next' when next fixes the bug
const next_1 = tslib_1.__importDefault(require("next"));
if (!process.env.NODE_ENV) {
    throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}
const isDev = process.env.NODE_ENV !== "production";
async function installSSR(app) {
    // @ts-ignore Next had a bad typing file, they claim `export default` but should have `export =`
    // Ref: https://unpkg.com/next@9.0.3/dist/server/next.js
    const nextApp = next_1.default({
        dev: isDev,
        dir: `${__dirname}/../../../client/src`,
        quiet: !isDev,
    });
    const handlerPromise = (async () => {
        await nextApp.prepare();
        return nextApp.getRequestHandler();
    })();
    // Foo
    handlerPromise.catch(e => {
        console.error("Error occurred starting Next.js; aborting process");
        console.error(e);
        process.exit(1);
    });
    app.get("*", async (req, res) => {
        const handler = await handlerPromise;
        handler(req, res);
    });
}
exports.default = installSSR;
//# sourceMappingURL=installSSR.js.map