import passport from "passport";
import { Express, Request } from "express";
export interface UserSpec {
    id: number;
    displayName: string;
    username: string;
    avatarUrl?: string;
    email: string;
    profile?: any;
    auth?: any;
}
export declare type GetUserInformationFunction = (profile: any, accessToken: string, refershToken: string, extra: any, req: Request) => UserSpec | Promise<UserSpec>;
declare const _default: (app: Express, service: string, Strategy: new (...args: any) => passport.Strategy, strategyConfig: any, authenticateConfig: any, getUserInformation: GetUserInformationFunction, tokenNames?: string[], { preRequest, postRequest, }?: {
    preRequest?: ((_req: Request<import("express-serve-static-core").ParamsDictionary>) => void) | undefined;
    postRequest?: ((_req: Request<import("express-serve-static-core").ParamsDictionary>) => void) | undefined;
}) => void;
export default _default;
//# sourceMappingURL=installPassportStrategy.d.ts.map