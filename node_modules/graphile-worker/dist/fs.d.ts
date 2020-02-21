/// <reference types="node" />
import * as rawFs from "fs";
export declare const stat: typeof rawFs.stat.__promisify__;
export declare const readFile: typeof rawFs.readFile.__promisify__;
export declare const readdir: typeof rawFs.readdir.__promisify__;
export declare function tryStat(pathToStat: string): Promise<rawFs.Stats | null>;
