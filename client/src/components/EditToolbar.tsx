import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import {
    GridRowModes,
    Toolbar,
    ToolbarButton,
} from '@mui/x-data-grid';
import type {
    GridRowModel,
    GridSlotProps,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

interface EditToolbarProps {
    toolbarProps: GridSlotProps['toolbar'];
    setRows: React.Dispatch<React.SetStateAction<GridRowModel[]>>;
    setRowModesModel: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function EditToolbar(props: EditToolbarProps) {
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
                { id: newId, name: '', email: '', password: '', isNew: true },
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
                    <AddIcon fontSize="small" color="primary" />
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    );
}