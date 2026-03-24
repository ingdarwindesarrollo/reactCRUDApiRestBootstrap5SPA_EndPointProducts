import { useState, useEffect } from 'react';
import { createUser, updateUser } from '../api/user.api';

function UserForm({ onSaved, selectedUser, onCancelEdit }) {
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (selectedUser) {
      setForm({ name: selectedUser.name, email: selectedUser.email });
    } else {
      setForm({ name: '', email: '' });
    }
  }, [selectedUser]);

  function handleChange(e) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedUser) {
      await updateUser(selectedUser.id, form);
    } else {
      await createUser(form);
    }
    setForm({ name: '', email: '' });
    onSaved();
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-5">
          <input
            className="form-control"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-5">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className={`btn ${selectedUser ? 'btn-warning' : 'btn-primary'} w-100`}>
            {selectedUser ? 'Actualizar' : 'Guardar'}
          </button>
          {selectedUser && (
            <button type="button" className="btn btn-secondary w-100" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default UserForm;