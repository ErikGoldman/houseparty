import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { ApproveHostMutation, PendingUserQuery, UserQuery } from "../graphql/user";

export const GQLSchema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: {
      approveHost: ApproveHostMutation,
    },
    name: "RootMutationType",
  }),
  query: new GraphQLObjectType({
    fields: {
      "pendingUsers": PendingUserQuery,
      "user": UserQuery,
    },
    name: "RootQueryType",
  }),
});