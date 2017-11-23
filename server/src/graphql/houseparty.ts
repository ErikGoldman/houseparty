import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, } from "graphql";

import { User } from "../entity/user";
import { Houseparty } from "../entity/houseparty";

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
     type: new GraphQLList(require("./user").GraphUser)
    },
 }),
});

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
   return User.getById(userId)
   .then((user) => {
     if (!user) {
       throw new Error("user not found");
     }
     return user.getHouseparty();
   });
 },
 type: GraphHouseparty,
};
