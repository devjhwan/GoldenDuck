import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getLastCustomer } from '../memdb';
import type { GridRowsProp, GridRowModesModel } from '@mui/x-data-grid/models';
import {
    GridRowModes,
    Toolbar,
    ToolbarButton,
} from '@mui/x-data-grid';
import type {
    GridSlotProps,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

export default function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const autoIncrementId = async () => {
    const lastCustomer = await getLastCustomer();
    return lastCustomer ? lastCustomer.id + 1 : 1;
  };

  const handleClick = async () => {
    const newId = await autoIncrementId();
    setRows((oldRows) => {
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
      const newModel = { ...oldModel };
      if (editingRowId)
        newModel[editingRowId] = { mode: GridRowModes.View, ignoreModifications: true };
      return {
        ...newModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }
    });

    setTimeout(() => {
      const grid = document.querySelector('.MuiDataGrid-virtualScroller');
      if (grid) {
        grid.scrollTop = grid.scrollHeight;
      }
    }, 50);
  };

  return (
    <Toolbar>
      <Typography color="primary" align="center" variant="h5" fontWeight="bold" sx={{ flex: 5, mx: 0.5 }}>
        Customer List
      </Typography>

      <Tooltip title="Add customer">
        <ToolbarButton onClick={handleClick}>
          {/* <AddIcon sx={{ fontSize: 26 }} color="primary"/> */}
          {/* <AddCircleOutlineIcon sx={{ fontSize: 26 }} color="primary"/> */}
          <AddCircleIcon sx={{ fontSize: 26 }} color="primary"/>
          
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}