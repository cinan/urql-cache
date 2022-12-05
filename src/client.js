import { createClient, dedupExchange, fetchExchange, subscriptionExchange, gql } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { createClient as createWSClient } from 'graphql-ws'

const cache = cacheExchange({
  updates: {
    Subscription: {
      updatedNode: async ({ updatedNode }, args, cache) => {
        console.log('incoming', updatedNode);

        const nodes = cache.resolve('Query', 'nodes')

        if (Array.isArray(nodes)) {
          const nodeKey = cache.keyOfEntity(updatedNode)

          const index = nodes.findIndex(_nodeKey => _nodeKey === nodeKey)

          if (index === -1) {
            nodes.push(updatedNode)
            cache.link('Query', 'nodes', nodes)
          }
        }
      }
    },
  },
});

const wsClient = createWSClient({
  url: 'ws://localhost:1234/graphql'
})

const client = createClient({
  url: 'http://localhost:1234/graphql',
  requestPolicy: 'cache-and-network',
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => ({
        subscribe: sink => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

export default client;
