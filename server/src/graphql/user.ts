import { GraphQLBoolean, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from "graphql";
 
import { User } from "../entity/user";

const GraphUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    displayName: { type: GraphQLString, },
    email: { type: GraphQLString, },
    photoUrl: { type: GraphQLString, },
    id: { type: GraphQLInt, },
    isHost: { type: GraphQLBoolean, },
    isAdmin: {
      resolve: (root: User, {}, req: Express.Request, fieldASTs: any) => {
        return root.isAdmin();
      },
      type: GraphQLBoolean
    },
  }
});

export const PendingUserQuery = {
  args: {
  },
  resolve: (
    root: any, {}, req: Express.Request, fieldASTs: any,
  ) => {
    return User.getPendingUsers()
  },
  type: new GraphQLList(GraphUser),
};

export const ApproveHostMutation = {
  args: {
    userId: {
      name: "userId",
      type: GraphQLInt,
    }
  },
  resolve: (
    root: any, { userId }: { userId: number }, req: Express.Request, fieldASTs: any,
  ) => {
    return User.approveHost(userId)
    .then(() => {
      return User.getPendingUsers();
    });
  },
  type: new GraphQLList(GraphUser),
};

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
    return User.getById(id)
  },
  type: GraphUser,
};
