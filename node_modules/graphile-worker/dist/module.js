"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("./fs");
const _module = require("module");
const { Module } = _module;
function stripBOM(str) {
    if (str.charCodeAt(0) === 0xfeff) {
        return str.slice(1);
    }
    return str;
}
/**
 * This function emulates the behaviour of `require()`, enabling us to call it
 * multiple times without worrying about having to clear out the cache (useful
 * for watch mode).
 */
async function fauxRequire(filename) {
    const contents = await fs_1.readFile(filename, "utf8");
    const code = stripBOM(contents);
    // Construct the module
    const replacementModule = new Module(filename, this);
    // And initialise it:
    // Ref: https://github.com/nodejs/node/blob/eb6741b15ebd93ffdd71e87cbc1350b9e94ef222/lib/internal/modules/cjs/loader.js#L616
    replacementModule.filename = filename;
    /*
     * This is naughty - we're using the Node internals. We should probably
     * instead duplicate the code here like @std/esm does:
     *
     * https://github.com/standard-things/esm/issues/66
     * https://github.com/standard-things/esm/blob/16035f6d25fdafb921a49401c7693a863cc14f81/src/module/static/node-module-paths.js
     * https://github.com/standard-things/esm/blob/16035f6d25fdafb921a49401c7693a863cc14f81/src/module/internal/load.js
     */
    // @ts-ignore
    replacementModule.paths = Module._nodeModulePaths(path_1.dirname(filename));
    // @ts-ignore
    replacementModule._compile(code, filename);
    replacementModule.loaded = true;
    return replacementModule.exports;
}
exports.fauxRequire = fauxRequire;
//# sourceMappingURL=module.js.map