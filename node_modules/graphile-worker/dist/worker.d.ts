import { TaskList, Worker, WithPgClient, WorkerOptions } from "./interfaces";
export declare function makeNewWorker(tasks: TaskList, withPgClient: WithPgClient, options?: WorkerOptions, continuous?: boolean): Worker;
