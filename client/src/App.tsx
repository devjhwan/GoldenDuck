import React, { useState } from 'react'
import './App.css'
import React, { useState } from 'react'
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [customerList, setCustomerList] = useState(customers);

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
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
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
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </Grid>
          <Grid size={12}>
            <AddUpdateForm />
          </Grid>
          <Grid size={12}>
            <button className="form-button delete" onClick={ handleDeleteAction }
                  disabled={selectedId === null}>
            Delete
          </button>
            <button className="form-button">Save</button>
            <button className="form-button">Cancel</button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

function BasicTable({
  selectedId,
  setSelectedId,
}: {
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((row) => {
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
                <TableCell align="right" sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.name}
                </TableCell>
                <TableCell align="right" sx={isSelected ? { fontWeight: 'bold' } : {}}>
                  {row.email}
                </TableCell>
                <TableCell align="right" sx={isSelected ? { fontWeight: 'bold' } : {}}>
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
