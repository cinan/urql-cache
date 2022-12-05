import * as React from 'react';
import { gql, useQuery, useSubscription } from 'urql';
import request from 'graphql-request'

const query = gql`
  query {
    nodes {
      id
      name
    }
  }
`

const mutationStandalone = gql`
  mutation($id: String!, $name: String!) {
    upsert(id: $id, name: $name) {
      id
      name
    }
  }
`

const subscriptionQuery = gql`
  subscription {
    updatedNode {
      id
      name
    }
  }
`

const Node = ({ id, name }) =>
  <div>
    <pre>Id: {id}, Name: {name}</pre>
    <button onClick={() => {
      // simulate external source of mutation; don't call useMutation()
      request(
        'http://localhost:1234/graphql',
        mutationStandalone,
        { id, name: `Node ${Math.random()}` },
      );
    }}>Rename
    </button>
    <hr />
  </div>

const Nodes = () => {
  const [res] = useQuery({ query })
  useSubscription({ query: subscriptionQuery })

  if (res.fetching) return null

  return <>{res.data.nodes.map(node => <Node {...node} key={node.id} />)}</>
}

export default Nodes;
