"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * How long to wait between polling for jobs.
 *
 * Note: this does NOT need to be short, because we use LISTEN/NOTIFY to be
 * notified when new jobs are added - this is just used for jobs scheduled in
 * the future, retried jobs, and in the case where LISTEN/NOTIFY fails for
 * whatever reason.
 */
exports.POLL_INTERVAL = 2000;
/**
 * How many errors in a row can we get fetching a job before we raise a higher
 * exception?
 */
exports.MAX_CONTIGUOUS_ERRORS = 10;
/**
 * Number of jobs to run concurrently
 */
exports.CONCURRENT_JOBS = 1;
//# sourceMappingURL=config.js.map