import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/product.api";
import ProductForm from "../components/productForm";

function Products() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [toast, setToast] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const res = await getProducts();
        const data = res.data;

        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        setProducts(data.map((p) => ({ id: p[0], name: p[1], price: p[2] })));
        } else {
        setProducts(data);
        }
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    async function handleDelete(id) {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        await deleteProduct(id);
        loadProducts();
        showToast('Producto eliminado correctamente.');
    }

    function handleEdit(product){
        setSelectedProduct(product);
    }

    function handleCancelEdit(){
        setSelectedProduct(null);
    }

    function handleSaved(){
        setSelectedProduct(null);
        loadProducts();
        showToast('Producto guardado correctamente.');
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-4">
      <h2 className="mb-4">Gestión de Productos</h2>

      {toast && (
        <div className="alert alert-success" role="alert">
          {toast}
        </div>
      )}

      {/* Tarjeta del formulario */}
      <div className="card mb-4">
        <div className="card-header">
          {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </div>
        <div className="card-body">
          {/* Le pasamos al formulario la función onSaved, el producto seleccionado
              y la función para cancelar la edición */}
          <ProductForm
            onSaved={handleSaved}
            selectedProduct={selectedProduct}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>

      {/* Tarjeta de la tabla */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Lista de Productos</span>
          <input
            className="form-control w-50"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Si no hay productos, mostramos un mensaje */}
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
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

export default Products;    