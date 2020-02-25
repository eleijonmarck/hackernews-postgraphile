"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const installDatabasePools_1 = require("./installDatabasePools");
/*
 * Stores where to redirect the user to on authentication success.
 * Tries to avoid redirect loops or malicious redirects.
 */
const setReturnTo = (req, _res, next) => {
    const BLOCKED_REDIRECT_PATHS = /^\/+(|auth.*|logout)(\?.*)?$/;
    if (!req.session) {
        next();
        return;
    }
    const returnTo = (req.query && req.query.next && String(req.query.next)) ||
        req.session.returnTo;
    if (returnTo &&
        returnTo[0] === "/" &&
        !returnTo.match(BLOCKED_REDIRECT_PATHS)) {
        req.session.returnTo = returnTo;
    }
    else {
        delete req.session.returnTo;
    }
    next();
};
exports.default = (app, service, Strategy, strategyConfig, authenticateConfig, getUserInformation, tokenNames = ["accessToken", "refreshToken"], { preRequest = (_req) => { }, postRequest = (_req) => { }, } = {}) => {
    const rootPgPool = installDatabasePools_1.getRootPgPool(app);
    passport_1.default.use(new Strategy({
        ...strategyConfig,
        callbackURL: `${process.env.ROOT_URL}/auth/${service}/callback`,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, extra, profile, done) => {
        try {
            const userInformation = await getUserInformation(profile, accessToken, refreshToken, extra, req);
            if (!userInformation.id) {
                throw new Error(`getUserInformation must return a unique id for each user`);
            }
            let session = null;
            if (req.user && req.user.session_id) {
                ({
                    rows: [session],
                } = await rootPgPool.query("select * from app_private.sessions where uuid = $1", [req.user.session_id]));
            }
            const { rows: [user], } = await rootPgPool.query(`select * from app_private.link_or_register_user($1, $2, $3, $4, $5)`, [
                session ? session.user_id : null,
                service,
                userInformation.id,
                JSON.stringify({
                    username: userInformation.username,
                    avatar_url: userInformation.avatarUrl,
                    email: userInformation.email,
                    name: userInformation.displayName,
                    ...userInformation.profile,
                }),
                JSON.stringify({
                    [tokenNames[0]]: accessToken,
                    [tokenNames[1]]: refreshToken,
                    ...userInformation.auth,
                }),
            ]);
            if (!user || !user.id) {
                const e = new Error("Registration failed");
                e["code"] = "FFFFF";
                throw e;
            }
            if (!session) {
                ({
                    rows: [session],
                } = await rootPgPool.query(`insert into app_private.sessions (user_id) values ($1) returning *`, [user.id]));
            }
            if (!session) {
                const e = new Error("Failed to create session");
                e["code"] = "FFFFF";
                throw e;
            }
            done(null, { session_id: session.uuid });
        }
        catch (e) {
            done(e);
        }
    }));
    app.get(`/auth/${service}`, setReturnTo, async (req, res, next) => {
        try {
            await preRequest(req);
        }
        catch (e) {
            next(e);
            return;
        }
        const realAuthDetails = typeof authenticateConfig === "function"
            ? authenticateConfig(req)
            : authenticateConfig;
        const step1Middleware = passport_1.default.authenticate(service, realAuthDetails);
        step1Middleware(req, res, next);
    });
    const step2Middleware = passport_1.default.authenticate(service, {
        failureRedirect: "/login",
        successReturnToOrRedirect: "/",
    });
    app.get(`/auth/${service}/callback`, async (req, res, next) => {
        try {
            await postRequest(req);
        }
        catch (e) {
            next(e);
            return;
        }
        step2Middleware(req, res, next);
    });
};
//# sourceMappingURL=installPassportStrategy.js.map