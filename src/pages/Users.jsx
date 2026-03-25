import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../api/user.api';
import UserForm from '../components/UserForm';

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState('');
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await getUsers();
    const data = res.data;
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      setUsers(data.map((u) => ({ id: u[0], name: u[1], email: u[2] })));
    } else {
      setUsers(data);
    }
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
    } 

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    await deleteUser(id);
    loadUsers();
    showToast('Usuario eliminado correctamente.');
  }

  function handleEdit(user) {
    setSelectedUser(user);
  }

  function handleCancelEdit() {
    setSelectedUser(null);
  }

  function handleSaved() {
    setSelectedUser(null);
    loadUsers();
    showToast('Usuario guardado correctamente.');
  }
  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Usuarios</h2>

      {toast && <div className="alert alert-success">{toast}</div>}

      <div className="card mb-4">
        <div className="card-header">
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </div>
        <div className="card-body">
          <UserForm
            onSaved={handleSaved}
            selectedUser={selectedUser}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">Lista de Usuarios</div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;