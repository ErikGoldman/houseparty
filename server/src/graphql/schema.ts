import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } from "graphql";

import { User } from "../entity/user";

const GraphUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    displayName: { type: GraphQLString, },
  }
});

export const UserQuery = {
  args: {
    id: {
      name: "id",
      type: GraphQLInt,
    },
  },
  resolve: (
    root: any, { id }: { id: number | void }, req: Express.Request, fieldASTs: any,
  ) => {
    if (!id || (req.user && req.user.id === id)) {
      return req.user;
    }
    return User.getById(id);
  },
  type: GraphUser,
};

export const GQLSchema = new GraphQLSchema({
  /*
  mutation: new GraphQLObjectType({
    fields: Mutators,
    name: "RootMutationType",
  }),
  */
  query: new GraphQLObjectType({
    fields: {
      "user": UserQuery,
    },
    name: "RootQueryType",
  }),
});