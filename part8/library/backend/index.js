require('dotenv').config()
const jwt = require('jsonwebtoken')

const { GraphQLError } = require('graphql')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(async () => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      born: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Author: {
     bookCount: async (root, args) => await Book.find({ author: root._id }).then(bookList => bookList.length)
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const query = {}

      if(args.author) {
        const authorEntry = await Author.findOne({ name: args.author })
        query.author = authorEntry._id
      }

      if(args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate('author')
    },
    allAuthors: async () => await Author.find({}),
    allGenres: async () => await Book.find({})
      .then(response => [...new Set(response.reduce((a, b) => a.concat(b.genres), []))])
      .then(response => { response.sort(); return response; }),
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if(!author) {
        try {
          const newAuthor = new Author({
            name: args.author,
            books: []
          })

          author = await newAuthor.save()
        } catch(error) {
          throw new GraphQLError('Saved new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      }

      const newBook = new Book({
        ...args,
        author: author._id
      })

      let savedBook = null
      try {
        savedBook = await newBook.save()
      } catch(error) {
        throw new GraphQLError('Saved book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return savedBook.populate('author')
    },
    editAuthor: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const author = await Author.findOne({ name: args.name })

      if(!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      author.born = args.born
      await author.save()

      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating new user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})