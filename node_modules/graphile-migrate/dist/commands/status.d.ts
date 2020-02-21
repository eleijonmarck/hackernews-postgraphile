import { Settings } from "../settings";
interface Status {
    remainingMigrations: Array<string>;
    hasCurrentMigration: boolean;
}
export declare function status(settings: Settings): Promise<Status>;
export {};
