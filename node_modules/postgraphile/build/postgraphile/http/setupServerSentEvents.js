"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
const stream_1 = require("stream");
function setupServerSentEvents(req, res, options) {
    const { _emitter } = options;
    // Making sure these options are set.
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    // Set headers for Server-Sent Events.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    if (req.httpVersionMajor >= 2) {
        // NOOP
    }
    else {
        res.setHeader('Connection', 'keep-alive');
    }
    const koaCtx = req['_koaCtx'];
    const isKoa = !!koaCtx;
    const stream = isKoa ? new stream_1.PassThrough() : null;
    if (isKoa) {
        koaCtx.response.body = stream;
        koaCtx.compress = false;
    }
    const sse = (str) => {
        if (isKoa) {
            stream.write(str);
        }
        else {
            res.write(str);
            // support running within the compression middleware.
            // https://github.com/expressjs/compression#server-sent-events
            if (typeof res.flushHeaders === 'function')
                res.flushHeaders();
        }
    };
    // Notify client that connection is open.
    sse('event: open\n\n');
    // Setup listeners.
    const schemaChangedCb = () => sse('event: change\ndata: schema\n\n');
    if (options.watchPg)
        _emitter.on('schemas:changed', schemaChangedCb);
    // Clean up when connection closes.
    const cleanup = () => {
        if (stream) {
            stream.end();
        }
        else {
            res.end();
        }
        _emitter.removeListener('schemas:changed', schemaChangedCb);
    };
    req.on('close', cleanup);
    req.on('finish', cleanup);
    req.on('error', cleanup);
    _emitter.on('test:close', cleanup);
}
exports.default = setupServerSentEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBTZXJ2ZXJTZW50RXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaGlsZS9odHRwL3NldHVwU2VydmVyU2VudEV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUEyQjtBQUMzQixtQ0FBcUM7QUFJckMsU0FBd0IscUJBQXFCLENBQzNDLEdBQW9CLEVBQ3BCLEdBQW1CLEVBQ25CLE9BQW9DO0lBRXBDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFN0IscUNBQXFDO0lBQ3JDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLHNDQUFzQztJQUN0QyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUNyQixHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLElBQUksR0FBRyxDQUFDLGdCQUFnQixJQUFJLENBQUMsRUFBRTtRQUM3QixPQUFPO0tBQ1I7U0FBTTtRQUNMLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsTUFBTSxNQUFNLEdBQUksR0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLG9CQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hELElBQUksS0FBSyxFQUFFO1FBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3pCO0lBRUQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULE1BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEI7YUFBTTtZQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFZixxREFBcUQ7WUFDckQsOERBQThEO1lBQzlELElBQUksT0FBUSxHQUFXLENBQUMsWUFBWSxLQUFLLFVBQVU7Z0JBQUcsR0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2xGO0lBQ0gsQ0FBQyxDQUFDO0lBRUYseUNBQXlDO0lBQ3pDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRXZCLG1CQUFtQjtJQUNuQixNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUVyRSxJQUFJLE9BQU8sQ0FBQyxPQUFPO1FBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVyRSxtQ0FBbUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ25CLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2Q7YUFBTTtZQUNMLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNYO1FBQ0QsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUM7SUFDRixHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxQixHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QixRQUFRLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBOURELHdDQThEQyJ9