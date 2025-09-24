import * as React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import EditToolbar from './EditToolbar';
import SnackbarManager from './SnackbarManager';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import type {
    GridRowsProp,
    GridRowModesModel,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModel
} from '@mui/x-data-grid';
import { getPaged, deleteById, post, put } from '../memdb'
import type { Customer } from '../memdb'


export default function FullFeaturedCrudGrid() {
    const [dataFetched, setDataFetched] = React.useState(false);
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [passwordVisibility, setPasswordVisibility] = React.useState<{ [key: number]: boolean }>({});
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'info' | 'error' | 'warning' | 'success'; type: string; id: number | null }>({
        open: false,
        message: '',
        severity: 'info',
        type: 'alert',
        id: null,
    });
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(25);
    const [rowCount, setRowCount] = React.useState(0);

    React.useEffect(() => {
        getPaged(page, pageSize)
            .then(({ data, total }) => {
                setRows(data as GridRowsProp);
                setRowCount(total);
            })
            .catch(() => {
                setRows([]);
                setRowCount(0);
            })
            .finally(() => setDataFetched(true));
    }, [page, pageSize]);

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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
        setSnackbar({
            open: true,
            message: '',
            severity: 'warning',
            type: 'deleteConfirmation',
            id: id as number,
        });
    };

    const confirmDelete = () => {
        if (snackbar.id !== null) {
            deleteById(snackbar.id)
                .then(() => {
                    console.log(`Deleted customer with id ${snackbar.id}`);
                    setRows([...rows.filter((row) => row.id !== snackbar.id)]);
                    setSnackbar({
                        open: true,
                        message: `User with ID ${snackbar.id} deleted successfully!`,
                        severity: 'success',
                        type: 'alert',
                        id: null,
                    });
                    setRowCount(rowCount - 1);
                })
                .catch((e) => console.log(e));
        }
    };

    const cancelDelete = () => {
        setSnackbar({ ...snackbar, open: false, id: null });
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
            setSnackbar({ open: true, message: 'All fields must be filled. Please complete the form.', severity: 'error', type: 'alert', id: null });
            throw new Error('Incomplete fields.');
        }

        // Check email field
        if (!emailRegex.test(newRow.email)) {
            setSnackbar({ open: true, message: 'Invalid email format. Please provide a valid email address.', severity: 'error', type: 'alert', id: null });
            throw new Error('Invalid email format.');
        }

        // Check password field
        if (!passwordRegex.test(newRow.password)) {
            setSnackbar({ open: true, message: 'Password must be at least 8 characters long and include at least one letter and one number.', severity: 'error', type: 'alert', id: null });
            throw new Error('Invalid password format.');
        }

        // Check for duplicate email
        const isDuplicateEmail = rows.some((row) => row.email === newRow.email && row.id !== newRow.id);
        if (isDuplicateEmail) {
            setSnackbar({ open: true, message: 'This email is already in use. Please use a different email address.', severity: 'error', type: 'alert', id: null });
            throw new Error('Duplicate email.');
        }

        const updatedRow = { ...newRow, isNew: false };
        if (newRow.isNew) {
            const { isNew, ...newCustomer } = newRow;
            post(newCustomer as Customer)
                .then(() => {
                    console.log(`Succesfully added new customer`);
                    getPaged(page, pageSize)
                        .then(({ data, total }) => {
                            setRows(data as GridRowsProp);
                            setRowCount(total);
                            console.log(`Successfully added new customer with id ${newRow.id}`);
                            setSnackbar({ open: true, message: `New user with ID ${newRow.id} successfully added!`, severity: 'success', type: 'alert', id: null });
                        })
                        .catch(() => {
                            setRows([]);
                            setRowCount(0);
                        });
                })
                .catch((e) => console.log(e))
        } else {
            put(newRow.id as number, newRow as Customer)
                .then(() => {
                    console.log(`Successfully edited customer with id ${newRow.id}`);
                    setSnackbar({ open: true, message: `User with ID ${newRow.id} successfully added!`, severity: 'success', type: 'alert', id: null });
                })
                .catch((e) => console.log(e))
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        }
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
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 240,
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 240,
            align: 'center',
            headerAlign: 'center',
            editable: true,
            renderCell: (params) => {
                const id = params.row.id;
                const isVisible = passwordVisibility[id];
                return (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            headerName: '',
            width: 150,
            align: 'right',
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
                        color="primary"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="error"
                    />,
                ];
            },
        },
    ];

    return (
        // <ThemeProvider theme={myTheme}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 500
                }}
            >
                <Box
                    sx={{
                        height: 520,
                        width: '65%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '& .actions': {
                            color: 'text.secondary',
                        },
                        '& .textPrimary': {
                            color: 'text.primary',
                        },
                        minWidth: 870
                    }}
                >
                    {!dataFetched ?
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="100vh">
                            <CircularProgress />
                        </Box>
                        :
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowClassName={(params)=> params.indexRelativeToCurrentPage % 2 ==0 ? 'even-row' : 'odd-row'}
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
                                },
                                '& .MuiDataGrid-columnHeader[data-field="actions"]':{
                                    display:'none',
                                },
                                '& .odd-row':{
                                    backgroundColor:'#F0F8FF',
                                },
                                // '& .even-row':{
                                //     backgroundColor:'#D0F0C0',
                                // },
                                '& .MuiDataGrid-row:hover':{
                                    backgroundColor:'#D3D3D3',
                                },
                                '& .MuiDataGrid-row.Mui-selected':{
                                    fontWeight: 'bold',
                                    backgroundColor:'#D3D3D3 !important',
                                }
                            }}
                            pagination
                            paginationModel={{ page: page - 1, pageSize }}
                            rowCount={rowCount}
                            paginationMode="server"
                            onPaginationModelChange={({ page, pageSize: newPageSize }) => {
                                const firstItemIndex = page * pageSize;
                                const newPage = Math.floor(firstItemIndex / newPageSize);
                                setPage(newPage + 1);
                                setPageSize(newPageSize);
                            }}
                            pageSizeOptions={[10, 25, 50, 100]}
                        />
                    }
                    <SnackbarManager
                        snackbar={snackbar as any}
                        onClose={handleSnackbarClose}
                        onDeleteConfirm={confirmDelete}
                        onDeleteCancel={cancelDelete}
                    />
                </Box>
            </div>
    );
}