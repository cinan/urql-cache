import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefinitions = /* GraphQL */ `
  type Query {
    companies: [Company!]!
    customers: [Customer!]!
  }

  type Mutation {
    updateCustomerWithNewCompany(id: String!, companyId: String): Customer
  }

  type Company {
    id: String!
  }

  type Customer {
    id: String!
    companyId: String
  }
`

const companies: Array<{ id: string }> = []
const customers: Array<{ id: string, companyId: string | null }> = [
  { id: '1', companyId: null }
]

const resolvers = {
  Query: {
    companies: () => {
      return companies
    },
    customers: () => {
      return customers
    }
  },
  Mutation: {
    updateCustomerWithNewCompany: (parent: unknown, args: { id: string, companyId?: string | null }) => {
      const customer = customers.find(c => c.id === args.id)

      if (!customer || args.companyId === undefined) return

      customer.companyId = args.companyId

      if (args.companyId) {
        if (!companies.find(c => c.id === args.companyId)) {
          companies.push({ id: args.companyId })
        }
      }

      console.log({ customers, companies });

      return customer
    },
  },
}


export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
