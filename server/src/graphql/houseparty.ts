import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, } from "graphql";

import { User } from "../entity/user";
import { Houseparty } from "../entity/houseparty";
import { Invite } from "../entity/invite";

export const GraphHouseparty = new GraphQLObjectType({
 name: 'Houseparty',
 fields: () => ({
   id: { type: GraphQLInt, },
   host: { type: require("./user").GraphUser, },
   date: { type: GraphQLString, },
   invites: {
    resolve: (houseparty: Houseparty, {}, req: Express.Request, fieldASTs: any) => {
      return houseparty.invites || [];
    },
     type: new GraphQLList(require("./invite").GraphInvite)
    },
 }),
});

export const SaveInviteMutation = {
  args: {
    hostId: {
      name: "hostdId",
      type: new GraphQLNonNull(GraphQLInt),
    },
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      name: "name",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (
    root: any, { email, name, hostId }: { email: string, hostId: number, name: string }, req: Express.Request, fieldASTs: any,
  ) => {
    return User.getById(req.user, hostId)
    .then((host) => {
      if (!host) {
        throw new Error("couldn't find user");
      }
      return User.getByEmail(req.user, email)
      .then((guest) => {
        if (!guest) {
          guest = new User();
          guest.displayName = name;
          guest.email = email;
          guest.hasSignedUp = false;
          return guest.save();
        }
        return guest;
      })
      .then((guest) => {
        return host.getHouseparty(req.user)
        .then((houseparty) => {
          if (!houseparty) {
            throw new Error("user does not have a schedule houseparty");
          }
          const invite = new Invite();
          invite.date = new Date().getTime();
          invite.houseparty = houseparty;
          invite.user = guest;
          return invite.save();
        });
      })
      .then(() => {
        return host.getHouseparty(req.user);
      });
    })
  },
  type: GraphHouseparty,
};

export const DeleteInviteMutation = {
  args: {
    inviteId: {
      name: "inviteId",
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (
    root: any, { inviteId }: { inviteId: number }, req: Express.Request, fieldASTs: any,
  ) => {
    return Invite.getById(req.user, inviteId)
    .then((invite) => {
      if (!invite) {
        throw new Error("couldn't find invite");
      }

      const housepartyId = invite.houseparty.id;
      return invite.delete()
      .then(() => {
        return Houseparty.getById(req.user, housepartyId);
      })
    });
  },
  type: GraphHouseparty,
};

export const HousepartyQuery = {
 args: {
   userId: {
     name: "userId",
     type: GraphQLInt,
   },
 },
 resolve: (
   root: any, { userId }: { userId: number | void }, req: Express.Request, fieldASTs: any,
 ) => {
   if (!req.user) {
     throw new Error("User not logged in");
   }

   if (!userId) {
     return req.user.houseparty;
   }
   return User.getById(req.user, userId)
   .then((user) => {
     if (!user) {
       throw new Error("user not found");
     }
     return user.getHouseparty(req.user);
   });
 },
 type: GraphHouseparty,
};
