import React, { useState } from 'react'
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';

// Update AddUpdateForm to use props
export default function AddForm(props: any) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  }

  function handleSave() {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    // Check for duplicate email
    const emailExists = props.customerList.some(
      (c: any) => c.email.toLowerCase() === form.email.toLowerCase()
    );
    if (emailExists) {
      setError("Email already exists. Please use a different email.");
      return;
    }
    const newCustomer = {
      id: props.customerList.length ? Math.max(...props.customerList.map((c: any) => c.id)) + 1 : 0,
      ...form,
    };
    props.setCustomerList([...props.customerList, newCustomer]);
    setForm({ name: '', email: '', password: '' });
    setError('');
    props.handleClose()
  }


  return (
    <form
        onSubmit={e => {
        e.preventDefault();
        handleSave();
        }}
        id='add-form'
    >
        <h2 className="form-title">ADD CUSTOMER</h2>
        <div className="form-row">
        <label htmlFor="name" className="form-label">Name</label>
        <input id="name" name="name" type="text" placeholder="Name" className="form-input" value={form.name} onChange={onInputChange} />
        </div>
        <div className="form-row">
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" className="form-input" value={form.email} onChange={onInputChange} />
        </div>
        <div className="form-row">
        <label htmlFor="password" className="form-label">Password</label>
        <input id="password" name="password" type="password" placeholder="Password" className="form-input" value={form.password} onChange={onInputChange} />
        </div>
        {error && (
        <div style={{ color: 'red', marginTop: 8, textAlign: 'right', fontSize: 14 }}>{error}</div>
        )}
        <DialogActions>
            <Button onClick={props.handleClose} className="addform-cancel-btn">
                Cancel
            </Button>
            <Button type="submit" form="add-form" className="addform-save-btn">
                Save
            </Button>
        </DialogActions>
    </form>
  );
}