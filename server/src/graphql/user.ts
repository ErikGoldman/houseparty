import { GraphQLBoolean, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";
 
import { User } from "../entity/user";
import { Donation } from "../entity/donation";
import { GraphQLFloat } from "graphql/type/scalars";
import { Houseparty } from "../entity/houseparty";

export const GraphUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    displayName: { type: GraphQLString, },
    donatedAmount: {
      resolve: (user: User, {}, req: Express.Request, fieldASTs: any) => {
        return Donation.find(user.displayName, user.email);
      },
      type: GraphQLFloat
    },
    email: { type: GraphQLString, },
    photoUrl: { type: GraphQLString, },
    id: { type: GraphQLInt, },
    hasSignedUp: { type: GraphQLBoolean, },
    houseparty: {
      resolve: (user: User, {}, req: Express.Request, fieldASTs: any) => {
        return user.getHouseparty(req.user);
      },
      type: require("./houseparty").GraphHouseparty,
    },
    isAdmin: {
      resolve: (user: User, {}, req: Express.Request, fieldASTs: any) => {
        return user.isAdmin();
      },
      type: GraphQLBoolean
    },
  }),
});

export const SignedUpUsersQuery = {
  args: {
  },
  resolve: (
    root: any, {}, req: Express.Request, fieldASTs: any,
  ) => {
    return User.getSignedUpUsers(req.user)
  },
  type: new GraphQLList(GraphUser),
};

export const SetHousepartyDateMutation = {
  args: {
    date: {
      name: "date",
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      name: "userId",
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (
    root: any, { date, userId }: { date: string, userId: number }, req: Express.Request, fieldASTs: any,
  ) => {
    return User.getById(req.user, userId)
    .then((user) => {
      if (!user) {
        throw new Error("could not find user");
      }

      if (!user.housepartyId) {
        let houseparty = new Houseparty();
        houseparty.invites = [];
        houseparty.date = date;
        return houseparty.save()
        .then((houseparty) => {
          user.housepartyId = houseparty.id;
          return user.save();
        });
      }

      return user.getHouseparty(req.user)
      .then((houseparty) => {
        if (!houseparty) {
          throw new Error("couldn't find houseparty");
        }

        houseparty.date = date;
        return houseparty.save()
        .then(() => {
          return user;
        })
      });
    })
  },
  type: GraphUser,
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
    return User.getById(req.user, id)
  },
  type: GraphUser,
};
