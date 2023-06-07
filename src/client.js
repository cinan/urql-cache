import { createClient, fetchExchange, gql } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools'

const cache = cacheExchange({
  updates: {
    Mutation: {
      updateCustomerWithNewCompany: (_, args, cache) => {
        if (!args.companyId) return

        // updateQuery method:

        // const query = gql`
        //   query {
        //     companies {
        //       id
        //     }
        //   }
        // `
        //
        // cache.updateQuery({ query }, data => {
        //   data.companies.push({ __typename: 'Company', id: args.companyId });
        //   return data;
        // })

        // cache.link method:

        const companies = cache.resolve('Query', 'companies')

        if (Array.isArray(companies)) {
          const company = { __typename: 'Company', id: args.companyId }
          const index = companies.indexOf(cache.keyOfEntity(company))

          if (index === -1) {
            companies.push(company)
            cache.link('Query', 'companies', companies)
          }
        }
      }
    }
  },
  optimistic: {
    updateCustomerWithNewCompany: (args) => {
      const optimistic = {
        __typename: 'Customer',
        id: args.id,
        companyId: args.companyId
      }

      console.log('opt', optimistic);

      return optimistic
    }
  }
});

const client = createClient({
  url: 'http://localhost:1234/graphql',
  exchanges: [
    devtoolsExchange,
    cache,
    fetchExchange,
  ],
});

export default client;
