import Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
});

const app = new Koa();
server.applyMiddleware({ app });

const port = process.env.PORT || 8081

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);

export default app.callback()