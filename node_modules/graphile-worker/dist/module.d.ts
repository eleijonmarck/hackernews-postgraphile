/**
 * This function emulates the behaviour of `require()`, enabling us to call it
 * multiple times without worrying about having to clear out the cache (useful
 * for watch mode).
 */
export declare function fauxRequire(filename: string): Promise<any>;
