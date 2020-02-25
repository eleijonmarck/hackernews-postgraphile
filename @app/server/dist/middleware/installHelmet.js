"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helmet_1 = tslib_1.__importDefault(require("helmet"));
function installHelmet(app) {
    app.use(helmet_1.default());
}
exports.default = installHelmet;
//# sourceMappingURL=installHelmet.js.map