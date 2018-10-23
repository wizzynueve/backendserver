const { makeExecutableSchema } = require('graphql-tools');

//Define resolvers
const{
	getUser_R,
	checkIfUserExists_R,
	loginUser_R,
	addUser_R,
	updateUser_R
} = require('.././resolvers/mongoDBResolver');

// Define mongodb connectors
const { 
  getUser_C,
  checkUserExists_C,
  loginUser_C,
  addUser_C,
  updateUser_C
} = require('../connectors/mongoDB')


const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    message: String
  }
  type Role {
    roles: [String]!
  }
  type UserPref {
    name: String!
    email: String!
    message: String
  }
  type UserExists {
    name: String!
    email: String!
    message: String
  }
  type LoginUser {
    token: String!
    message: String!
  }
  type Query {
    getUser_Q: UserExists
    checkUserExists_Q(email:String!): UserExists
    loginUser_Q(email:String!,password:String!): LoginUser
  }
  type Mutation {
    addUser_M(name:String!,email:String!,password:String!): User
    updateUser_M(name:String!,email:String!,password:String!): UserPref
  }
 `;

 const resolvers = {
  Query: {
    getUser_Q: (_, args, context) => getUser_R(context, getUser_C),
    checkUserExists_Q: (_, args, context) => checkIfUserExists_R(args, checkUserExists_C), //check if user email already exists, for new user id creation
    loginUser_Q: (_, args, context) => loginUser_R(args, loginUser_C),
  },
  Mutation: {
    addUser_M: (_, args, context) => addUser_R(args, addUser_C), // first time user is created see - connector where a dummy role is inserted
    updateUser_M: (_, args, context) => updateUser_R(context, args, updateUser_C), //check jwt token, validate if user is self then update own email & password but NOT the roles
  },
};

module.exports = new makeExecutableSchema({ typeDefs, resolvers });
