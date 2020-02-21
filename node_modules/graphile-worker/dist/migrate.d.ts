import { PoolClient } from "pg";
export declare function migrate(client: PoolClient): Promise<void>;
