import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

let users = {
  1: {
    id: '1',
    username: 'rwieruch',
    firstname: 'Robin',
    lastname: 'Wieruch',
  },
  2: {
    id: '2',
    username: 'ddavids',
    firstname: 'Dave',
    lastname: 'Davids',
  },
};

const app = express();
app.use(cors());
const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
    fullname: String!
  }
`;
const resolvers = {
  Query: {
    me: (parent, args, { me }, info) => {
      return me;
    },
    user: (parent, { id }, context, info) => {
      return users[id];
    },
    users: (parent, args, context, info) => {
      return Object.values(users);
    },
  },

  User: {
    fullname: (parent, args, context, info) =>
      `${parent.firstname} ${parent.lastname}`,
  },
};
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});
server.applyMiddleware({ app, path: '/graphql' });
app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };
const user = {
  ...userCredentials,
  ...userDetails,
};
console.log(user);
console.log(process.env.SOME_ENV_VARIABLE);
