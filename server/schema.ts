import { makeExecutableSchema } from '@graphql-tools/schema'
import { createPubSub } from 'graphql-yoga'

const pubSub = createPubSub()

const typeDefinitions = /* GraphQL */ `
  type Query {
    nodes: [Node!]!
  }

  type Mutation {
    upsert(id: String!, name: String!): Node!
  }

  type Subscription {
    updatedNode: Node!
  }

  type Node {
    id: String!
    name: String!
  }
`

const nodes = [{ id: '1', name: 'Node 1' }]

const resolvers = {
  Query: {
    nodes: () => {
      return nodes
    }
  },
  Mutation: {
    upsert: (parent: unknown, args: { id: string, name: string }) => {
      const existingNode = nodes.find(node => node.id === args.id)
      if (existingNode) {
        existingNode.name = args.name
        pubSub.publish('updated', existingNode)
        return existingNode
      } else {
        const newNode = { id: args.id, name: args.name }
        nodes.push(newNode)
        pubSub.publish('updated', newNode)
        return newNode
      }
    }
  },
  Subscription: {
    updatedNode: {
      subscribe: () => pubSub.subscribe('updated'),
      resolve: (node: any) => node
    }
  },
}


export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
