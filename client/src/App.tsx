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
import { createTheme, ThemeProvider } from "@mui/material";


declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}


const myTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&.Mui-selected": {
            fontWeight: "bold",
          }
        }
      }
    }
  }
});

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    let id = ''
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', email: '', password: '', isNew: true},
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
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
  const [reload, setReload] = React.useState({});
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [passwordVisibility, setPasswordVisibility] = React.useState<{ [key: number]: boolean }>({});

  React.useEffect(() => {
    getAll()
      .then((data) => setRows(data as GridRowsProp))
      .catch(() => setRows([]))
  }, [])

  React.useEffect(() => {
    if (reload) {
      getAll()
        .then((data) => setRows(data as GridRowsProp))
        .catch(() => setRows([]))
    }
  }, [reload]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteById(id as number)
      .then(() => console.log(`Delete customer with id ${id}`))
    setRows(rows.filter((row) => row.id !== id));
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
    if (newRow.id !== '') {
      put(newRow.id as number, newRow as Customer)
        .then(() => console.log(`Succesfully edited customer with id ${newRow.id}`))
        .catch((e) => console.log(e))
    } else {
      const { isNew, ...newCustomer } = newRow;
      post(newCustomer as Customer)
        .then(() => {
          console.log(`Succesfully added new customer`)
          setReload(true);
        })
        .catch((e) => console.log(e))
    }

    //add new customer and call the backand all data again
    //add new customer and add statick rows
    
    const updatedRow = { ...newRow, isNew: false };
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
            className="textPrimary"
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
    <ThemeProvider theme={myTheme}>
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
      >
    {/* <DataGrid.Resources>
      <Style TargetType="{x:Type dg:DataGridCell}">
        <Style.Triggers>
          <Trigger Property="dg:DataGridCell.IsSelected" Value="True">
            <Setter Property="Background" Value="#CCDAFF" />
          </Trigger>
        </Style.Triggers>
      </Style>
    </DataGrid.Resources> */}
      </DataGrid>
    </Box>
    </ThemeProvider>

  );
}