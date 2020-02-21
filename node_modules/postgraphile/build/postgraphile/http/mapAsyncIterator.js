"use strict";
// This file is a copy from the GraphQL codebase, modified to work in TypeScript:
//   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/mapAsyncIterator.js
/* tslint:disable no-any */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iterall_1 = require("iterall");
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
function mapAsyncIterator(iterable, callback, rejectCallback) {
    const iterator = iterall_1.getAsyncIterator(iterable);
    let $return;
    let abruptClose;
    // $FlowFixMe(>=0.68.0)
    if (typeof iterator.return === 'function') {
        $return = iterator.return;
        abruptClose = (error) => {
            const rethrow = () => Promise.reject(error);
            return $return.call(iterator).then(rethrow, rethrow);
        };
    }
    function mapResult(result) {
        return result.done
            ? result
            : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
    }
    let mapReject;
    if (rejectCallback) {
        // Capture rejectCallback to ensure it cannot be null.
        const reject = rejectCallback;
        mapReject = (error) => asyncMapValue(error, reject).then(iteratorResult, abruptClose);
    }
    /* TODO: Flow doesn't support symbols as keys:
       https://github.com/facebook/flow/issues/3258 */
    return {
        next() {
            return iterator.next().then(mapResult, mapReject);
        },
        return() {
            return $return
                ? $return.call(iterator).then(mapResult, mapReject)
                : Promise.resolve({ value: undefined, done: true });
        },
        throw(error) {
            // $FlowFixMe(>=0.68.0)
            if (typeof iterator.throw === 'function') {
                return iterator.throw(error).then(mapResult, mapReject);
            }
            return Promise.reject(error).catch(abruptClose);
        },
        [iterall_1.$$asyncIterator]() {
            return this;
        },
    };
}
exports.default = mapAsyncIterator;
function asyncMapValue(value, callback) {
    return new Promise(resolve => resolve(callback(value)));
}
function iteratorResult(value) {
    return { value, done: false };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwQXN5bmNJdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvaHR0cC9tYXBBc3luY0l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBaUY7QUFDakYsNkhBQTZIO0FBQzdILDJCQUEyQjtBQUMzQjs7Ozs7OztHQU9HOztBQUVILHFDQUE0RDtBQUc1RDs7O0dBR0c7QUFDSCxTQUF3QixnQkFBZ0IsQ0FDdEMsUUFBMEIsRUFDMUIsUUFBdUMsRUFDdkMsY0FBZ0Q7SUFFaEQsTUFBTSxRQUFRLEdBQUcsMEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFZLENBQUM7SUFDakIsSUFBSSxXQUFnQixDQUFDO0lBQ3JCLHVCQUF1QjtJQUN2QixJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7UUFDekMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDMUIsV0FBVyxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7S0FDSDtJQUVELFNBQVMsU0FBUyxDQUFDLE1BQVc7UUFDNUIsT0FBTyxNQUFNLENBQUMsSUFBSTtZQUNoQixDQUFDLENBQUMsTUFBTTtZQUNSLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxJQUFJLFNBQWMsQ0FBQztJQUNuQixJQUFJLGNBQWMsRUFBRTtRQUNsQixzREFBc0Q7UUFDdEQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO1FBQzlCLFNBQVMsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQzVGO0lBRUQ7c0RBQ2tEO0lBQ2xELE9BQU87UUFDTCxJQUFJO1lBQ0YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsTUFBTTtZQUNKLE9BQU8sT0FBTztnQkFDWixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFDRCxLQUFLLENBQUMsS0FBVTtZQUNkLHVCQUF1QjtZQUN2QixJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7Z0JBQ3hDLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3pEO1lBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsQ0FBQyx5QkFBZSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFwREQsbUNBb0RDO0FBRUQsU0FBUyxhQUFhLENBQU8sS0FBUSxFQUFFLFFBQXVDO0lBQzVFLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUksS0FBUTtJQUNqQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNoQyxDQUFDIn0=