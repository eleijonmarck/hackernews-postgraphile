"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphile_utils_1 = require("graphile-utils");
/*
 * PG NOTIFY events are sent via a channel, this function helps us determine
 * which channel to listen to for the currently logged in user by extracting
 * their `user_id` from the GraphQL context.
 *
 * NOTE: channels are limited to 63 characters in length (this is a PostgreSQL
 * limitation).
 */
const currentUserTopicFromContext = async (_args, context, _resolveInfo) => {
    if (context.sessionId /* fail fast */) {
        // We have the users session ID, but to get their actual ID we need to ask the database.
        const { rows: [user], } = await context.pgClient.query("select app_public.current_user_id() as id");
        if (user) {
            return `graphql:user:${user.id}`;
        }
    }
    throw new Error("You're not logged in");
};
/*
 * This plugin adds a number of custom subscriptions to our schema. By making
 * sure our subscriptions are tightly focussed we can ensure that our schema
 * remains scalable and that developers do not get overwhelmed with too many
 * subscription options being open. You can also use external sources of realtime
 * data when PostgreSQL's LISTEN/NOTIFY is not sufficient.
 *
 * Read more about this in the PostGraphile documentation:
 *
 * https://www.graphile.org/postgraphile/subscriptions/#custom-subscriptions
 *
 * And see the database trigger function `app_public.tg__graphql_subscription()`.
 */
const SubscriptionsPlugin = graphile_utils_1.makeExtendSchemaPlugin(build => {
    const { pgSql: sql } = build;
    return {
        typeDefs: graphile_utils_1.gql `
       type UserSubscriptionPayload {
        user: User # Populated by our resolver below
        event: String # Part of the NOTIFY payload
      }

      extend type Subscription {
        """Triggered when the logged in user's record is updated in some way."""
        currentUserUpdated: UserSubscriptionPayload @pgSubscription(topic: ${graphile_utils_1.embed(currentUserTopicFromContext)})
      }
    `,
        resolvers: {
            UserSubscriptionPayload: {
                user: recordByIdFromTable(build, sql.fragment `app_public.users`),
            },
        },
    };
});
/*
 * This function handles the boilerplate of fetching a record from the database
 * which has the 'id' equal to the 'subject' from the PG NOTIFY event payload
 * (see `tg__graphql_subscription()` trigger function in the database).
 */
function recordByIdFromTable(build, sqlTable) {
    const { pgSql: sql } = build;
    return async (event, _args, _context, { graphile: { selectGraphQLResultFromTable } }) => {
        const rows = await selectGraphQLResultFromTable(sqlTable, (tableAlias, sqlBuilder) => {
            sqlBuilder.where(sql.fragment `${tableAlias}.id = ${sql.value(event.subject)}`);
        });
        return rows[0];
    };
}
exports.default = SubscriptionsPlugin;
//# sourceMappingURL=SubscriptionsPlugin.js.map