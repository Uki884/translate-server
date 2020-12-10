import { ApolloServer, gql } from 'apollo-server-micro';
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

const graphqlPath = '/api/graphql'
const graphqlHandler = server.createHandler({ path: graphqlPath });
export default graphqlHandler