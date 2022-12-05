import { schema } from './schema'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
// @ts-ignore
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

const yogaApp = createYoga({
  schema,
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: 'WS',
  }
})

// Get NodeJS Server from Yoga
const httpServer = createServer(yogaApp)
// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint
})

// Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload
        })

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe
        }
      }

      const errors = validate(args.schema, args.document)
      if (errors.length) return errors
      return args
    }
  },
  wsServer
)

httpServer.listen(1234, () => {
  console.log('Server is running on port 1234')
})
