import { Express } from "express";
declare global {
    namespace Express {
        interface User {
            session_id: string;
        }
    }
}
declare const _default: (app: Express) => Promise<void>;
export default _default;
//# sourceMappingURL=installPassport.d.ts.map