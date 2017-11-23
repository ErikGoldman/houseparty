import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { SetHousepartyDateMutation, SignedUpUsersQuery, UserQuery } from "../graphql/user";
import { HousepartyQuery } from "../graphql/houseparty";

export const GQLSchema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: {
      setHousepartyDate: SetHousepartyDateMutation,
    },
    name: "RootMutationType",
  }),
  query: new GraphQLObjectType({
    fields: {
      "signedUpUsers": SignedUpUsersQuery,
      "houseparty": HousepartyQuery,
      "user": UserQuery,
    },
    name: "RootQueryType",
  }),
});