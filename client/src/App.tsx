import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import type {
  GridRowsProp,
  GridRowModesModel,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridSlotProps,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { getAll, deleteById, post, put } from './memdb'
import type { Customer } from './memdb'

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const autoIncrementId = (rows: GridRowModel[]) => {
    const numericIds = rows
      .map(row => Number(row.id))
      .filter(id => !isNaN(id));
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  }

  const handleClick = () => {
    let newId = 0;
    setRows((oldRows) => {
      newId = autoIncrementId([...oldRows])
      const newRow = oldRows.find((row) => row.isNew)
      let updatedRows = oldRows;
      if (newRow && newRow.isNew)
        updatedRows = oldRows.filter((row) => row.id !== newRow.id)
      return [
        ...updatedRows,
        { id: newId, name: '', email: '', password: '', isNew: true},
      ]
    });
    setRowModesModel((oldModel) => {
      const editingRowId = Object.keys(oldModel).find(
        (id) => oldModel[id]?.mode === GridRowModes.Edit
      );
      let newModel = { ...oldModel };
      if (editingRowId)
        newModel[editingRowId] = { mode: GridRowModes.View, ignoreModifications: true };
      return {
        ...newModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }
    });
  };

  return (
    <Toolbar>
    <Typography fontWeight="bold" sx={{ flex: 1, mx: 0.5 }}>
        Customer List
      </Typography>

      <Tooltip title="Add customer">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" color="primary"/>
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [passwordVisibility, setPasswordVisibility] = React.useState<{ [key: number]: boolean }>({});
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [successSnackbar, setSuccessSnackbar] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [deleteSnackbar, setDeleteSnackbar] = React.useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '' });
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbar({ open: false, message: '' });
  };

  const handleDeleteSnackbarClose = () => {
    setDeleteSnackbar({ open: false, id: null });
  };

  React.useEffect(() => {
    getAll()
      .then((data) => setRows(data as GridRowsProp))
      .catch(() => setRows([]))
  }, [])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    console.log('edit')
    const newRow = rows.find((row) => row.isNew)
    if (newRow && newRow.isNew)
      setRows(rows.filter((row) => row.id !== newRow.id))
    setRowModesModel((oldModel) => {
      const editingRowId = Object.keys(oldModel).find(
        (id) => oldModel[id]?.mode === GridRowModes.Edit
      );
      let newModel = { ...oldModel };
      if (editingRowId)
        newModel[editingRowId] = { mode: GridRowModes.View, ignoreModifications: true };
      return {
        ...newModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }
    });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeleteSnackbar({ open: true, id: id as number });
  };

  const confirmDelete = () => {
    if (deleteSnackbar.id !== null) {
      deleteById(deleteSnackbar.id)
        .then(() => {
          console.log(`Deleted customer with id ${deleteSnackbar.id}`);
          setRows(rows.filter((row) => row.id !== deleteSnackbar.id));
          setSuccessSnackbar({ open: true, message: `User with ID ${deleteSnackbar.id} deleted successfully!` });
        })
        .catch((e) => console.log(e));
    }
    handleDeleteSnackbarClose();
  };

  const cancelDelete = () => {
    handleDeleteSnackbarClose();
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

    // Check if all fields are filled
    if (!newRow.name || !newRow.email || !newRow.password) {
      setSnackbar({ open: true, message: 'All fields must be filled. Please complete the form.' });
      throw new Error('Incomplete fields.');
    }

    // Check email field
    if (!emailRegex.test(newRow.email)) {
      setSnackbar({ open: true, message: 'Invalid email format. Please provide a valid email address.' });
      throw new Error('Invalid email format.');
    }

    // Check password field
    if (!passwordRegex.test(newRow.password)) {
      setSnackbar({ open: true, message: 'Password must be at least 8 characters long and include at least one letter and one number.' });
      throw new Error('Invalid password format.');
    }

    // Check for duplicate email
    const isDuplicateEmail = rows.some((row) => row.email === newRow.email && row.id !== newRow.id);
    if (isDuplicateEmail) {
      setSnackbar({ open: true, message: 'This email is already in use. Please use a different email address.' });
      throw new Error('Duplicate email.');
    }

    if (newRow.isNew) {
      const { isNew, ...newCustomer } = newRow;
      post(newCustomer as Customer)
        .then(() => console.log(`Succesfully added new customer`))
        .catch((e) => console.log(e))
    } else {
      put(newRow.id as number, newRow as Customer)
        .then(() => console.log(`Succesfully edited customer with id ${newRow.id}`))
        .catch((e) => console.log(e))
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleTogglePassword = (id: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 180, 
      editable: true },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      editable: true,
    },
    {
      field: 'password',
      headerName: 'Password',
      width: 220,
      editable: true,
      renderCell: (params) => {
        const id = params.row.id;
        const isVisible = passwordVisibility[id];
        return (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>
              {isVisible ? params.value : '•'.repeat(10)}
            </span>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => handleTogglePassword(id)}
              title={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </span>
          </span>
        );
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
material={{
                sx: {
                  color: 'primary.main',
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        showToolbar
        columnHeaderHeight={36}
        sx={{
          '.MuiDataGrid-columnHeaderTitle': { 
             fontWeight: 'bold !important',
             overflow: 'visible !important'
          }
        }}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackbar.open}
        autoHideDuration={4000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSuccessSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successSnackbar.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSnackbar.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          sx={{ width: '100%' }}
          action={
            <>
              <button onClick={confirmDelete} style={{ marginRight: 8 }}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </>
          }
        >
          Are you sure you want to delete user with ID {deleteSnackbar.id}?
        </Alert>
      </Snackbar>
    </Box>
  );
}