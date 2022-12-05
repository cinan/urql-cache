import * as React from 'react';
import { gql, useMutation } from 'urql';
// import request from 'graphql-request'

export const mutation = gql`
  mutation($id: String!, $name: String!) {
    upsert(id: $id, name: $name) {
      id
      name
    }
  }
`

const Nodes = () => {
  const [, add] = useMutation(mutation)
  return <button onClick={() => {
    const id = Math.random()
    return add({ id: '' + id, name: `Node ${id}` });
    // request(
    //   'http://localhost:1234/graphql',
    //   mutation,
    //   { id: '' + id, name: `Node ${id}` }
    // );
  }}>Add</button>
}


export default Nodes;
