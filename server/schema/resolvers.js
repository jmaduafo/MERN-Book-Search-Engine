const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')

module.exports.resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // Checks if user is logged in
            // If so, show all the books under the user logged in (you)
            if (context.user) {
                const userData = await User
                    .findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('books');

                return userData;
            };  
            
            // User can't access application without being logged in
            throw new AuthenticationError("You must be logged in!")
        }
    },
    Mutation: {
        login: async (parent, args, context) => {
            const { email, password } = args
            const user = await User.findOne({
                email
            })

            // Checks if user entered the right information
            if (!user) {
                throw new AuthenticationError('Login credentials are incorrect!')
            };

            // Checks if 'password' and 'confirm password' are the same
            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('The passwords do not match!')
            }

            // If there are no problems, give the user the access token
            const token = signToken(user)
            return { token, user }
        },

        addUser: async (parent, args, context) => {
            // Create a new user that takes in all the needed arguments
            // Then assign a new token to the new user
            const user = await User.create(args)
            const token = signToken(user);

            return { user, token }
        }


    }
}