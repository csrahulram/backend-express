import { buildSchema, GraphQLScalarType, Kind } from 'graphql';
import mongoose from 'mongoose';

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: any) {
    return value.getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value: any) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10))
    }
    // Invalid hard-coded value (not an integer)
    return null
  },
})

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdDate: Date,
  status: String,
  dueDate: Date
})

const TodoModel = mongoose.model(
  'todo',
  TodoSchema,
  'todo',
);

// Define GraphQL Schema
export const schema = buildSchema(`
  scalar Date,
  type Todo {
    title: String,
    description: String,
    createdDate: Date,
    status: String,
    dueDate: Date
  }

  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!, description: String): Todo
    updateTodo(id: ID!, title: String, description: String): Todo
    deleteTodo(id: ID!): Todo
    viewTodo(id: ID!): Todo
  }
`);


// Define Resolvers
export const root = {
  todos: async () => {
    return await TodoModel.find()
  },
  todo: async ({ id }: any) => {
    return await TodoModel.findById(id);
  },
  createTodo: async ({ title, description }: any) => {
    const todo = new TodoModel({ title, description });
    await todo.save();
    return todo;
  },
  updateTodo: async ({ id, title, description }: any) => {
    return await TodoModel.findByIdAndUpdate(
      id,
      { $set: { title, description } }
    );
  },
  deleteTodo: async ({ id }: any) => {
    return await TodoModel.findByIdAndDelete(id);
  },

  viewTodo: async ({ id }: any) => {
    return await TodoModel.findByIdAndDelete(id);
  },
};