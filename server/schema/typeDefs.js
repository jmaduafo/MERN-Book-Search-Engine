const { gql } = require('apollo-server-express')

module.exports.typeDefs = gql`
    type Query {
        me: User
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Books]
        bookCount: Int
    }

    type Books {
        _id: ID!
        authors: [String!]!
        description: String!
        bookId: String!
        image: String
        link: String
        title: String
    }

    input BookInput {
        bookId: String!
        authors: [String!]!
        description: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, username: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: ID!): User
    }
`