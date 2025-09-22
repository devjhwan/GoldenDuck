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
import FormDialog from './FormDialog';

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
    console.log(`Delete customer with id ${selectedId}`)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={2} >
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
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormDialog customerList={customerList} setCustomerList={setCustomerList} />
          </Grid>
          <Grid size={12}>
            <button className="form-button delete" onClick={ handleDeleteAction }
                  disabled={selectedId === null} style={selectedId === null ? { pointerEvents: 'none' } : {}}>
            Delete
          </button>
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


export default App
