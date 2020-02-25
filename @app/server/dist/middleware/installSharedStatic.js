"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.default = (app) => {
    app.use(express_1.static(`${__dirname}/../../public`));
};
//# sourceMappingURL=installSharedStatic.js.map