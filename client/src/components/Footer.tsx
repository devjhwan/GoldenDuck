import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Footer() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, height:'50px',  justifyContent: 'center', alignItems: 'center'}}>
                <Typography>© 2025 GoldenDuck Inc. All rights reserved.</Typography>
            </AppBar>
      </Box>
    );
}