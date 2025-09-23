import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarConfig {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    type?: 'deleteConfirmation' | 'alert'; // Add more types if needed
    id?: number | null; // For delete confirmation
}

interface SnackbarsManagerProps {
    snackbar: SnackbarConfig;
    onClose: () => void;
    onDeleteConfirm?: () => void; // For delete confirmation
    onDeleteCancel?: () => void; // For delete confirmation
}

const SnackbarsManager: React.FC<SnackbarsManagerProps> = ({
    snackbar,
    onClose,
    onDeleteConfirm,
    onDeleteCancel,
}) => {
    const { open, message, severity, type, id } = snackbar;

    if (type === 'deleteConfirmation') {
        return (
            <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert
                    severity="warning"
                    sx={{ width: '100%' }}
                    action={
                        <>
                            <button onClick={onDeleteConfirm} style={{ marginRight: 8 }}>
                                Yes
                            </button>
                            <button onClick={onDeleteCancel}>No</button>
                        </>
                    }
                >
                    Are you sure you want to delete user with ID {id}?
                </Alert>
            </Snackbar>
        );
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarsManager;