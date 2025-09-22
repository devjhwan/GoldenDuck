import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AddForm from './AddForm';

export default function FormDialog(props: any) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button className="form-button" onClick={ handleOpen }>Add</button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <AddForm
            customerList={props.customerList} 
            setCustomerList={props.setCustomerList}
            handleClose={handleClose} 
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}