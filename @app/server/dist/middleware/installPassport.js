"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_github_1 = require("passport-github");
const lodash_1 = require("lodash");
const installPassportStrategy_1 = tslib_1.__importDefault(require("./installPassportStrategy"));
const app_1 = require("../app");
exports.default = async (app) => {
    passport_1.default.serializeUser((sessionObject, done) => {
        done(null, sessionObject.session_id);
    });
    passport_1.default.deserializeUser((session_id, done) => {
        done(null, { session_id });
    });
    const passportInitializeMiddleware = passport_1.default.initialize();
    app.use(passportInitializeMiddleware);
    app_1.getWebsocketMiddlewares(app).push(passportInitializeMiddleware);
    const passportSessionMiddleware = passport_1.default.session();
    app.use(passportSessionMiddleware);
    app_1.getWebsocketMiddlewares(app).push(passportSessionMiddleware);
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
    if (process.env.GITHUB_KEY) {
        await installPassportStrategy_1.default(app, "github", passport_github_1.Strategy, {
            clientID: process.env.GITHUB_KEY,
            clientSecret: process.env.GITHUB_SECRET,
            scope: ["user:email"],
        }, {}, async (profile, _accessToken, _refreshToken, _extra, _req) => ({
            id: profile.id,
            displayName: profile.displayName || "",
            username: profile.username,
            avatarUrl: lodash_1.get(profile, "photos.0.value"),
            email: profile.email || lodash_1.get(profile, "emails.0.value"),
        }), ["token", "tokenSecret"]);
    }
};
//# sourceMappingURL=installPassport.js.map