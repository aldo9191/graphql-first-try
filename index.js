import {  ApolloServer, UserInputError, gql } from 'apollo-server'
import {v1 as uuid} from 'uuid'

const persons = [
  {
    name: "Aldo",
    age: "30",
    city: "Lima",
    id:"1"
  },
  {
    name: "Cristina",
    age: "24",
    city: "Huayncayo",
    id:"2"
  },
  {
    name: "Alvaro",
    age: "26",
    city: "London",
    id:"3"
  }

];

const typeDefinitions = gql`
type Person {
  name: String!
  age: String!
  city: String!
  id: ID!
}
type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
}

type Mutation {
  addPerson(
    name: String!
    age: String!
    city: String!
  ): Person
}

`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args
      return persons.find(person => person.name === name)
    }
  },
  Mutation: {
    addPerson: (root,args) => {
      if (persons.find(p => p.name === args.name)){
        throw new UserInputError('Person already exists', {
          invalidArgs: args.name
        })
      }
      const person = {...args, id: uuid() }
      persons.push(person)
      return person
    }
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({url}) => {
  console.log (`Server listening on ${url}`)
})