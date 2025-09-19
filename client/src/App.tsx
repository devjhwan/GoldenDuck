import './App.css'
// import * as React from 'react';
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
          <BasicTable />
        </Grid>
        <Grid size={12}>
          <AddUpdateForm />
        </Grid>
      </Grid>
    </Box>
    </>
  )
}

function BasicTable() {
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
          {customers.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.password}</TableCell>
            </TableRow>
          ))}
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
