import { GraphQLSchema, GraphQLObjectType, GraphQLString, buildSchema, GraphQLNonNull, GraphQLID } from 'graphql';

/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 */

// In-memory Todo storage
let todos: any[] = [];
let idCounter = 1;

// GraphQL Schema
export const schemaDef = buildSchema(`
    type Todo {
      id: ID!
      title: String!
      completed: Boolean!
    }
  
    type Query {
      todos: [Todo!]!
      todo(id: ID!): Todo
    }
  
    type Mutation {
      addTodo(title: String!): Todo
      toggleTodo(id: ID!): Todo
      deleteTodo(id: ID!): Boolean
    }
  `);

// Resolvers
const root = {
  todos: () => todos,
  todo: ({ id }: any) => todos.find(t => t.id === id),
  addTodo: ({ title }: any) => {
    const todo = { id: String(idCounter++), title, completed: false };
    todos.push(todo);
    return todo;
  },
  toggleTodo: ({ id }: any) => {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    return todo;
  },
  deleteTodo: ({ id }: any) => {
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      return true;
    }
    return false;
  }
};

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_parent, { id }) => {
          const result = await dbOperation(id);

          return result + id;

        },
      },
      world: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: (_parent, { id }) => {
          return 'World' + id;
        },
      },
    },
  }),
});

const dbOperation = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return `User-${id}`
}