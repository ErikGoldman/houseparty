import { GraphQLObjectType, GraphQLInt, GraphQLString, } from "graphql";

export const GraphInvite = new GraphQLObjectType({
  name: 'Invite',
  fields: () => ({
    id: { type: GraphQLInt, },
    date: { type: GraphQLString, },
    user: { type: require("./user").GraphUser },
    houseparty: { type: require("./houseparty").GraphHouseparty },
  }),
});