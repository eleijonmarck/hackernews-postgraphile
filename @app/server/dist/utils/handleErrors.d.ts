import { GraphQLError } from "graphql";
declare const pluck: (err: any) => {
    [key: string]: any;
};
/**
 * This map allows you to override the error object output to users from
 * database errors.
 *
 * See `docs/error_codes.md` for a list of error codes we use internally.
 *
 * See https://www.postgresql.org/docs/current/errcodes-appendix.html for a
 * list of error codes that PostgreSQL produces.
 */
export declare const ERROR_MESSAGE_OVERRIDES: {
    [code: string]: typeof pluck;
};
export default function handleErrors(errors: readonly GraphQLError[]): Array<any>;
export {};
//# sourceMappingURL=handleErrors.d.ts.map