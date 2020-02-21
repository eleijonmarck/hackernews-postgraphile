import { ParsedSettings } from "./settings";
interface ActionSpecBase {
    _: string;
    shadow?: boolean;
}
export interface SqlActionSpec extends ActionSpecBase {
    _: "sql";
    file: string;
}
export interface CommandActionSpec extends ActionSpecBase {
    _: "command";
    command: string;
}
export declare type ActionSpec = SqlActionSpec | CommandActionSpec;
export declare function executeActions(parsedSettings: ParsedSettings, shadow: boolean | undefined, actions: ActionSpec[]): Promise<void>;
export declare function makeValidateActionCallback(): (inputValue: unknown) => Promise<ActionSpec[]>;
export {};
