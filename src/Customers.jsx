import * as React from 'react';
import { gql, Query, useMutation } from 'urql';

const query = gql`
  query {
    customers {
      id
      companyId
    }

    companies {
      id
    }
  }
`

const mutation = gql`
  mutation($id: String!, $companyId: String) {
    updateCustomerWithNewCompany(id: $id, companyId: $companyId) {
      id
      companyId
    }
  }
`

const Customer = ({ id, companyId, companies = [] }) => {
  const company = companies.find(c => c.id === companyId)
  const [,updateCustomer] = useMutation(mutation)

  return (
    <div>
      <pre>Id: {id}, Company: {company?.id || '(empty)'}</pre>

      {company?.id && (
        <button onClick={() => {
          updateCustomer({ id, companyId: null })
        }}>Disconnect Company</button>
      )}

      <button onClick={() => {
        updateCustomer({ id, companyId: `${+new Date}` })
      }}>Create and connect company</button>
    </div>
  )
}

const Customers = () => {
  return (
    <Query query={query}
           // requestPolicy="cache-and-network"
    >
      {res => res.data?.customers.map(customer =>
        <Customer {...customer} key={customer.id} companies={res.data?.companies} />
      )}
    </Query>
  )
}

export default Customers;
