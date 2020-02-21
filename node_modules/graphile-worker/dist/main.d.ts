import { Pool, PoolClient } from "pg";
import { TaskList, WorkerPool, WorkerOptions, WorkerPoolOptions } from "./interfaces";
declare const allWorkerPools: Array<WorkerPool>;
export { allWorkerPools as _allWorkerPools };
export declare function runTaskList(tasks: TaskList, pgPool: Pool, options?: WorkerPoolOptions): WorkerPool;
export declare const runTaskListOnce: (tasks: TaskList, client: PoolClient, options?: WorkerOptions) => Promise<void>;
