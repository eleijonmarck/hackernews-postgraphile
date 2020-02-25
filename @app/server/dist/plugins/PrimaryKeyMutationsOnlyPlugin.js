"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrimaryKeyMutationsOnlyPlugin = builder => {
    builder.hook("build", build => {
        build.pgIntrospectionResultsByKind.constraint.forEach((constraint) => {
            if (!constraint.tags.omit && constraint.type !== "p") {
                constraint.tags.omit = ["update", "delete"];
            }
        });
        return build;
    }, [], [], ["PgIntrospection"]);
};
exports.default = PrimaryKeyMutationsOnlyPlugin;
//# sourceMappingURL=PrimaryKeyMutationsOnlyPlugin.js.map