import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { SetHousepartyDateMutation, SignedUpUsersQuery, UserQuery } from "../graphql/user";
import { DeleteInviteMutation, HousepartyQuery, SaveInviteMutation } from "../graphql/houseparty";

export const GQLSchema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: {
      deleteInvite: DeleteInviteMutation,
      saveInvite: SaveInviteMutation,
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