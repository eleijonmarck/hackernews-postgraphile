"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defer() {
    let resolve;
    let reject;
    return Object.assign(new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    }), 
    // @ts-ignore error TS2454: Variable 'resolve' is used before being assigned.
    { resolve, reject });
}
exports.default = defer;
//# sourceMappingURL=deferred.js.map