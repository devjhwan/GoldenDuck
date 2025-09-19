import './App.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

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
      <AddUpdateForm />
    </>
  )
}

function AddUpdateForm() {
  return (
    <Card sx={{ maxWidth: 400, margin: '24px auto' }}>
      <CardContent>
        <form>
          <h2 className="form-title">Add / Update customer</h2>
          <div className="form-row">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" type="text" placeholder="Name" className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" placeholder="Email" className="form-input" />
          </div>
          <div className="form-row">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" placeholder="Password" className="form-input" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default App
