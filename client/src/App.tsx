import './App.css'

let customers = [
    {
      "id": 0,
      "name": "Mary Jackson",
      "email": "maryj@abc.com",
      "password": "maryj"
    },
    {
      "id": 1,      
      "name": "Karen Addams",
      "email": "karena@abc.com",
      "password": "karena"
    },
    {
      "id": 2,
      "name": "Scott Ramsey",
      "email": "scottr@abc.com",
      "password": "scottr"
    }
  ]

function App() {
  return (
    <>
      <h1>Customer List</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            id: {customer.id}, name: {customer.name}, email: {customer.email}, password: {customer.password}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
