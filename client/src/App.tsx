import React, { useState } from 'react'
import './App.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { getAll } from './memdb'

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
  console.log(getAll())
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [customerList, setCustomerList] = useState(customers);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function handleDeleteAction() {
    if (selectedId === null) return;

    // Check if customer exists
    const exists = customerList.some(c => c.id === selectedId);
    if (!exists) {
      alert("Customer not found.");
      return;
    }

    // Remove customer and update state
    const updatedList = customerList.filter(c => c.id !== selectedId);
    setCustomerList(updatedList);
    setSelectedId(null);
    console.log(`Delete customer with id ${selectedId}`)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  }

  function handleSave() {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    // Check for duplicate email
    const emailExists = customerList.some(
      (c) => c.email.toLowerCase() === form.email.toLowerCase()
    );
    if (emailExists) {
      setError("Email already exists. Please use a different email.");
      return;
    }
    const newCustomer = {
      id: customerList.length ? Math.max(...customerList.map(c => c.id)) + 1 : 0,
      ...form,
    };
    setCustomerList([...customerList, newCustomer]);
    setForm({ name: '', email: '', password: '' });
    setError('');
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={2} sx={{ maxWidth: 1000 }}>
          <Grid size={12}>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Customers List
            </Typography>
            <BasicTable
              customerList={customerList}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </Grid>
          <Grid size={12}>
            <AddUpdateForm form={form} onInputChange={handleInputChange} error={error}/>
          </Grid>
          <Grid size={12}>
            <button className="form-button delete" onClick={ handleDeleteAction }
                  disabled={selectedId === null} style={selectedId === null ? { pointerEvents: 'none' } : {}}>
            Delete
          </button>
            <button className="form-button" onClick={handleSave}>Save</button>
            <button className="form-button">Cancel</button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

function BasicTable({
  customerList,
  selectedId,
  setSelectedId,
}: {
  customerList: typeof customers,
  selectedId: number | null,
  setSelectedId: (id: number | null) => void
}) {
  function handleRowClick(id: number) {
    if (selectedId !== id )
      console.log(`selected customer with id ${id}.`)
    else
      console.log("Deselect customor.")
    setSelectedId(selectedId === id ? null : id);
  }

  return (
    <TableContainer sx={{ maxWidth: 900}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerList.map((row) => {
            const isSelected = selectedId === row.id;
            return (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: isSelected ? '#e3f2fd' : 'inherit',
                  cursor: 'pointer'
                }}
                onClick={() => handleRowClick(row.id)}
              >
                <TableCell component="th" scope="row" sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.id}
                </TableCell>
                <TableCell sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.name}
                </TableCell>
                <TableCell sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.email}
                </TableCell>
                <TableCell sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.password}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Update AddUpdateForm to use props
function AddUpdateForm({ form, onInputChange, error }: {
  form: { name: string; email: string; password: string },
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: string
}) {
  return (
    <Card sx={{ maxWidth: 400, margin: '24px auto' }}>
      <CardContent>
        <form>
          <h2 className="form-title">Add / Update customer</h2>
          <div className="form-row">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" type="text" placeholder="Name" className="form-input" value={form.name} onChange={onInputChange} />
          </div>
          <div className="form-row">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" placeholder="Email" className="form-input" value={form.email} onChange={onInputChange} />
          </div>
          <div className="form-row">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" className="form-input" value={form.password} onChange={onInputChange} />
          </div>
          {error && (
            <div style={{ color: 'red', marginTop: 8, textAlign: 'right', fontSize: 14 }}>{error}</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default App
