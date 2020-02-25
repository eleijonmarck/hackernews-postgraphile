/// <reference types="node" />
import { Server } from "http";
import express, { Express } from "express";
import { ShutdownAction } from "./shutdownActions";
import { Middleware } from "postgraphile";
export declare function getHttpServer(app: Express): Server | void;
export declare function getShutdownActions(app: Express): ShutdownAction[];
export declare function getWebsocketMiddlewares(app: Express): Middleware<express.Request, express.Response>[];
export declare function makeApp({ httpServer, }?: {
    httpServer?: Server;
}): Promise<Express>;
//# sourceMappingURL=app.d.ts.map