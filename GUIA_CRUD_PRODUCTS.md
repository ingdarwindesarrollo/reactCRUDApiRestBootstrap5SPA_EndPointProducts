# Guía paso a paso: Crear un CRUD completo para Products

> **¿Qué vamos a hacer?**  
> El servidor ya tiene un endpoint `/api/products` listo y funcionando.  
> Nuestra tarea es conectar React con ese endpoint para poder **ver, agregar, editar y eliminar productos** desde el navegador.  
> La tabla de productos tiene tres columnas: **id**, **name** y **price** (como viste en la base de datos).

---

## ¿Qué es un CRUD?

CRUD son las cuatro operaciones básicas que se hacen con datos:

| Letra | Operación | ¿Qué hace?                     | Método HTTP |
|-------|-----------|-------------------------------|-------------|
| C     | Create    | Crea un registro nuevo         | POST        |
| R     | Read      | Lee / muestra los registros    | GET         |
| U     | Update    | Actualiza un registro          | PUT         |
| D     | Delete    | Borra un registro              | DELETE      |

---

## Estructura de archivos que vamos a crear

Cuando terminemos, estos serán los archivos nuevos dentro de `src/`:

```
src/
 ├── api/
 │    ├── user.api.js          ← ya existe (no lo tocamos)
 │    └── product.api.js       ← NUEVO: las funciones para hablar con la API
 ├── components/
 │    ├── UserForm.jsx          ← ya existe (no lo tocamos)
 │    └── ProductForm.jsx       ← NUEVO: formulario para crear/editar productos
 └── pages/
      ├── Users.jsx             ← ya existe (no lo tocamos)
      └── Products.jsx          ← NUEVA: página principal de productos
```

También modificaremos `src/routes/AppRouter.jsx` para añadir la ruta `/products`.

---

## PASO 1 — Crear el archivo de API

**¿Por qué existe este archivo?**  
En React, lo mejor es separar todo lo que tiene que ver con "hablar con el servidor" en un archivo aparte.  
Así, si el día de mañana cambia la URL del servidor, solo cambiamos **un archivo** y no tocamos nada más.

**¿Qué es `axios`?**  
`axios` es una librería que nos permite hacer peticiones HTTP (GET, POST, PUT, DELETE) de forma muy sencilla.  
Es como un mensajero que lleva y trae datos entre React y el servidor.

### Crea el archivo: `src/api/product.api.js`

```js
import axios from 'axios';

// Esta es la URL base del endpoint de productos en tu servidor.
// Cada función de abajo usará esta URL.
const API = 'http://localhost:3000/api/products';

// READ — Obtener TODOS los productos
// Hace GET /api/products
export const getProducts = () => axios.get(API);

// READ — Obtener UN producto por su id
// Hace GET /api/products/1  (si id = 1)
export const getProductById = (id) => axios.get(`${API}/${id}`);

// CREATE — Crear un producto nuevo
// Hace POST /api/products  con los datos en el body
export const createProduct = (data) => axios.post(API, data);

// UPDATE — Actualizar un producto existente
// Hace PUT /api/products/1  con los datos nuevos en el body
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);

// DELETE — Eliminar un producto
// Hace DELETE /api/products/1
export const deleteProduct = (id) => axios.delete(`${API}/${id}`);
```

> **¿Ves el patrón?**  
> Es exactamente igual que `user.api.js`, solo cambiamos la URL y los nombres.  
> Cada función devuelve una **Promise** (promesa), lo que significa que la respuesta no llega de inmediato — llega cuando el servidor responde.

---

## PASO 2 — Crear el formulario de productos

**¿Por qué un componente separado para el formulario?**  
El formulario sirve para **dos cosas a la vez**: crear un producto nuevo Y editar uno existente.  
Separarlo en su propio componente permite que lo reutilicemos desde la página sin repetir código.

**¿Qué es `useState`?**  
`useState` le dice a React: *"guarda este valor y, cuando cambie, vuelve a dibujar el componente"*.  
Lo usamos para guardar lo que el usuario escribe en los campos del formulario.

**¿Qué es `useEffect`?**  
`useEffect` ejecuta código cuando algo cambia. Aquí lo usamos para detectar cuándo el usuario hace clic en "Editar" (el `selectedProduct` cambia) y rellenar el formulario con los datos de ese producto.

### Crea el archivo: `src/components/ProductForm.jsx`

```jsx
import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api/product.api';

// Este componente recibe tres "instrucciones" desde la página padre:
//   onSaved       → avisa a la página que se guardó algo (para recargar la lista)
//   selectedProduct → el producto que se quiere editar (null si es uno nuevo)
//   onCancelEdit  → avisa a la página que el usuario canceló la edición
function ProductForm({ onSaved, selectedProduct, onCancelEdit }) {

  // Aquí guardamos lo que el usuario escribe.
  // El formulario tiene dos campos: name y price.
  const [form, setForm] = useState({ name: '', price: '' });

  // Cuando cambia el producto seleccionado (porque el usuario hizo clic en "Editar"),
  // rellenamos el formulario con sus datos.
  // Si no hay producto seleccionado (modo "nuevo"), dejamos el formulario vacío.
  useEffect(() => {
    if (selectedProduct) {
      setForm({ name: selectedProduct.name, price: selectedProduct.price });
    } else {
      setForm({ name: '', price: '' });
    }
  }, [selectedProduct]); // ← Este array dice: "ejecuta esto SOLO cuando selectedProduct cambie"

  // Esta función se llama cada vez que el usuario escribe en cualquier campo.
  // [e.target.name] usa el atributo "name" del input para saber qué campo actualizar.
  // Por ejemplo, si escribe en el input con name="price", actualiza form.price.
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Esta función se llama cuando el usuario hace clic en "Guardar" o "Actualizar".
  // e.preventDefault() evita que la página se recargue (comportamiento por defecto del form).
  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedProduct) {
      // Si hay un producto seleccionado → estamos editando → usamos PUT
      await updateProduct(selectedProduct.id, form);
    } else {
      // Si no hay producto seleccionado → estamos creando → usamos POST
      await createProduct(form);
    }

    // Limpiamos el formulario después de guardar
    setForm({ name: '', price: '' });

    // Avisamos a la página padre que se guardó algo
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">

        {/* Campo: Nombre del producto */}
        <div className="col-md-5">
          <input
            className="form-control"
            name="name"           // ← importante: debe coincidir con la clave en `form`
            placeholder="Nombre del producto"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo: Precio del producto */}
        <div className="col-md-4">
          <input
            className="form-control"
            type="number"
            name="price"          // ← importante: debe coincidir con la clave en `form`
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Botones de acción */}
        <div className="col-md-3 d-flex gap-2">
          <button
            type="submit"
            className={`btn ${selectedProduct ? 'btn-warning' : 'btn-success'} w-100`}
          >
            {/* El texto del botón cambia según si estamos creando o editando */}
            {selectedProduct ? 'Actualizar' : 'Guardar'}
          </button>

          {/* El botón "Cancelar" solo aparece cuando estamos editando */}
          {selectedProduct && (
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={onCancelEdit}
            >
              Cancelar
            </button>
          )}
        </div>

      </div>
    </form>
  );
}

export default ProductForm;
```

---

## PASO 3 — Crear la página Products

**¿Qué es una "página" en React?**  
Una página es un componente que ocupa toda la pantalla cuando el usuario visita una URL.  
Por ejemplo, cuando vayas a `/products`, React mostrará el componente `Products`.

**¿Cómo funciona la lógica?**  
- Al cargar la página, llamamos a `getProducts()` y guardamos los resultados en `useState`.
- El array `products` se pasa a una tabla HTML para mostrarlos.
- Los botones Editar/Eliminar llaman a funciones que actualizan el estado o llaman a la API.

### Crea el archivo: `src/pages/Products.jsx`

```jsx
import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api/product.api';
import ProductForm from '../components/ProductForm';

function Products() {

  // Aquí guardamos la lista de productos que viene del servidor.
  // Empieza como un array vacío porque al principio no tenemos datos.
  const [products, setProducts] = useState([]);

  // Aquí guardamos el producto que el usuario quiere editar.
  // null significa "no estamos editando ninguno" (modo crear).
  const [selectedProduct, setSelectedProduct] = useState(null);

  // useEffect con array vacío [] → se ejecuta UNA SOLA VEZ cuando la página carga.
  // Es el momento perfecto para pedir los datos al servidor.
  useEffect(() => {
    loadProducts();
  }, []);

  // Función que pide todos los productos al servidor y los guarda en el estado.
  async function loadProducts() {
    const res = await getProducts();
    const data = res.data;

    // El servidor puede devolver los datos en dos formatos:
    // Formato A (array de objetos): [{ id:1, name:"Laptop", price:350 }, ...]
    // Formato B (array de arrays):  [[1, "Laptop", 350], ...]
    // Detectamos cuál es y normalizamos a formato A.
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      setProducts(data.map((p) => ({ id: p[0], name: p[1], price: p[2] })));
    } else {
      setProducts(data);
    }
  }

  // Se llama cuando el usuario hace clic en "Eliminar".
  // Pedimos confirmación antes de borrar (buena práctica).
  async function handleDelete(id) {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    await deleteProduct(id);  // llamamos a la API para borrar
    loadProducts();           // recargamos la lista
  }

  // Se llama cuando el usuario hace clic en "Editar".
  // Guardamos el producto en el estado para que el formulario lo reciba.
  function handleEdit(product) {
    setSelectedProduct(product);
  }

  // Se llama cuando el usuario hace clic en "Cancelar" en el formulario.
  function handleCancelEdit() {
    setSelectedProduct(null);
  }

  // Se llama cuando el formulario guarda exitosamente (crear o editar).
  function handleSaved() {
    setSelectedProduct(null); // limpiamos la selección
    loadProducts();           // recargamos la lista para ver el cambio
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Productos</h2>

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
        <div className="card-header">Lista de Productos</div>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                // Si hay productos, los recorremos con .map() y creamos una fila por cada uno.
                // `key={p.id}` es obligatorio en React para identificar cada elemento de la lista.
                products.map((p) => (
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
```

---

## PASO 4 — Agregar la ruta en AppRouter

**¿Por qué necesitamos una ruta?**  
`react-router-dom` es el "semáforo" de nuestra app.  
Le dice a React: *"cuando el usuario vaya a la URL `/products`, muestra el componente `Products`"*.  
Sin la ruta, aunque crees el componente, nunca aparecerá en el navegador.

### Modifica `src/routes/AppRouter.jsx`

**Antes:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from '../pages/Users';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

**Después (agrega las líneas marcadas con ←):**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from '../pages/Users';
import Products from '../pages/Products';   // ← importa el nuevo componente

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/products" element={<Products />} />  {/* ← nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

> **¿Qué cambia exactamente?**  
> - Línea 3: importamos `Products` igual que ya se importaba `Users`.  
> - Dentro de `<Routes>`: añadimos un `<Route>` nuevo que apunta a `/products`.

---

## PASO 5 — Probar que todo funciona

Arranca el servidor de desarrollo si no lo tienes corriendo:

```bash
npm run dev
```

Luego abre tu navegador y ve a:

```
http://localhost:5173/products
```

Deberías ver:
1. **La lista de productos** (Laptop $350.00 y CPU $200.00, los que vimos en la base de datos).
2. **El formulario** arriba para crear un producto nuevo.
3. Al hacer clic en **Editar**, el formulario se rellena con los datos del producto.
4. Al hacer clic en **Eliminar**, aparece la confirmación y el producto desaparece.

---

## Diagrama del flujo completo

```
Usuario (navegador)
       │
       │  escribe en el form / hace clic
       ▼
 ProductForm.jsx
       │
       │  llama a createProduct() / updateProduct() / deleteProduct()
       ▼
 product.api.js  ──── axios ────►  Servidor (http://localhost:3000/api/products)
                                          │
                  ◄──── respuesta ────────┘
       │
       │  llama a onSaved() / onChange()
       ▼
 Products.jsx
       │
       │  llama a loadProducts()  →  getProducts()  →  axios  →  Servidor
       │
       │  guarda en useState([...])
       ▼
  Tabla HTML (se vuelve a dibujar con los datos nuevos)
```

---

## Resumen de los 4 archivos y para qué sirve cada uno

| Archivo                        | ¿Para qué sirve?                                                   |
|--------------------------------|--------------------------------------------------------------------|
| `src/api/product.api.js`       | Contiene las funciones que hablan con el servidor (GET, POST, etc.) |
| `src/components/ProductForm.jsx` | Formulario reutilizable para crear y editar productos             |
| `src/pages/Products.jsx`       | Página completa: muestra el formulario y la tabla con todos los productos |
| `src/routes/AppRouter.jsx`     | Le dice a React qué componente mostrar según la URL               |

---

## Reto extra (practica por tu cuenta)

Una vez que todo funcione, intenta añadir estas mejoras:

1. **Validación de precio**: muestra un error si el usuario escribe un precio negativo o cero.
2. **Barra de navegación**: crea un componente `Navbar.jsx` con links a `/` (Usuarios) y `/products` (Productos).
3. **Mensaje de éxito**: muestra un toast/alerta verde cuando se guarda o elimina un producto.
4. **Búsqueda**: añade un input de búsqueda que filtre la tabla por nombre de producto usando `.filter()`.

> Recuerda: el patrón para agregar un nuevo CRUD siempre es el mismo:
> **api → formulario → página → ruta**. ¡Ya lo sabes de memoria!
