import { PostGraphileOptions, Middleware } from "postgraphile";
import { Pool } from "pg";
import { Express, Request, Response } from "express";
interface IPostGraphileOptionsOptions {
    websocketMiddlewares?: Middleware<Request, Response>[];
    rootPgPool: Pool;
}
export declare function getPostGraphileOptions({ websocketMiddlewares, rootPgPool, }: IPostGraphileOptionsOptions): PostGraphileOptions<Request<import("express-serve-static-core").ParamsDictionary>, Response>;
export default function installPostGraphile(app: Express): void;
export {};
//# sourceMappingURL=installPostGraphile.d.ts.map