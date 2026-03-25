# Guía Paso a Paso: 4 Mejoras para tu App React
## Explicada línea por línea, como para un niño 🧒

---

## ¿Qué vamos a construir?

Tenemos una aplicación React que gestiona **Productos** y **Usuarios**.
Vamos a agregarle 4 mejoras:

| # | Mejora | ¿Qué hace? |
|---|--------|-----------|
| 1 | Validación de precio | Muestra un mensaje en rojo si el precio es 0 o negativo |
| 2 | Barra de navegación (Navbar) | Permite ir entre la página de Usuarios y Productos |
| 3 | Mensaje de éxito (Toast) | Muestra un aviso verde cuando guardas o eliminas |
| 4 | Búsqueda | Filtra la tabla de productos mientras escribes |

---

## 📚 Conceptos clave antes de empezar

### ¿Qué es `useState`?
`useState` es una función de React que permite guardar información dentro de un componente.
Imagina que es una **caja** con un valor guardado. Cuando cambias el valor, React redibuja
la pantalla automáticamente.

```jsx
const [mensaje, setMensaje] = useState(''); 
//      ↑ valor    ↑ función para cambiarlo   ↑ valor inicial (vacío)
```

### ¿Qué es un componente?
Un componente es una **pieza reutilizable de la interfaz**. Es una función que devuelve
HTML (JSX). Por ejemplo, `<Navbar />` es un componente que contiene el menú de navegación.

### ¿Qué es JSX?
Es la mezcla de JavaScript con HTML que usa React. Te permite escribir `<div>Hola</div>`
dentro del código JavaScript.

### ¿Qué es `.filter()`?
Es una función de JavaScript que recorre un array y devuelve solo los elementos que
cumplen una condición.

```js
const numeros = [1, 2, 3, 4, 5];
const mayoresDe3 = numeros.filter(n => n > 3); 
// resultado: [4, 5]
```

---

## ═══════════════════════════════════════════════
## MEJORA 1 — Validación de Precio
## ═══════════════════════════════════════════════

### ¿Por qué necesitamos esto?
Sin validación, un usuario podría guardar un producto con precio **-10** o **0**.
Eso no tiene sentido en un negocio real. Queremos mostrar un mensaje de error en rojo
antes de que se envíe el formulario.

### Archivo a modificar: `src/components/productForm.jsx`

---

### Código completo explicado línea por línea:

```jsx
import { useState, useEffect } from 'react';
// ↑ Importamos useState (para guardar datos) y useEffect (para reaccionar a cambios)
// useState → guarda el estado del formulario y del error
// useEffect → detecta cuándo cambia el producto seleccionado para editar

import { createProduct, updateProduct } from '../api/product.api';
// ↑ Importamos las funciones que hacen llamadas al servidor (API)
// createProduct → envía un POST al servidor para CREAR un producto
// updateProduct → envía un PUT al servidor para ACTUALIZAR un producto


function ProductForm({ onSaved, selectedProduct, onCancelEdit }) {
// ↑ Declaramos el componente. Recibe 3 "regalos" (props):
//   onSaved         → función que se llama cuando el formulario se guardó exitosamente
//   selectedProduct → el producto que queremos editar (o null si es uno nuevo)
//   onCancelEdit    → función que se llama cuando el usuario cancela la edición


    const [form, setForm] = useState({ name: '', price: '' });
    // ↑ Caja que guarda lo que el usuario escribe en el formulario
    //   form.name  → guarda el texto del campo "Nombre del producto"
    //   form.price → guarda el número del campo "Precio del producto"
    //   Empezamos con todo vacío ('') porque es un formulario en blanco


    const [priceError, setPriceError] = useState('');
    // ↑ Nueva caja para el mensaje de error del precio
    //   Si está vacía ('') → no hay error, no se muestra nada
    //   Si tiene texto → se muestra ese texto en rojo debajo del campo de precio


    useEffect(() => {
    // ↑ useEffect es como decirle a React: "cada vez que cambie selectedProduct, 
    //   ejecuta este código"

        if (selectedProduct) {
        // ↑ Si hay un producto seleccionado para editar...

            setForm({ name: selectedProduct.name, price: selectedProduct.price });
            // ↑ ...llenamos el formulario con los datos de ese producto
            //   para que el usuario vea los valores actuales y pueda cambiarlos

        } else {
            setForm({ name: '', price: '' });
            // ↑ Si no hay producto seleccionado, limpiamos el formulario
            //   (modo "crear nuevo")
        }

        setPriceError('');
        // ↑ Siempre que cambia el producto seleccionado, borramos cualquier error previo

    }, [selectedProduct]);
    // ↑ El array [selectedProduct] le dice a React: "solo ejecuta este efecto
    //   cuando cambie selectedProduct", no en cada render


    function handleChange(e) {
    // ↑ Esta función se ejecuta cada vez que el usuario escribe en cualquier campo
    //   'e' es el evento del navegador (contiene info sobre qué campo cambió y qué valor tiene)

        setForm({ ...form, [e.target.name]: e.target.value });
        // ↑ Actualiza el formulario manteniendo todos los campos anteriores (...form)
        //   y cambiando solo el campo que el usuario tocó
        //   e.target.name  → el atributo name del input (ej: 'price')
        //   e.target.value → el nuevo texto que escribió el usuario

        if (e.target.name === 'price') {
        // ↑ Solo hacemos la validación cuando el campo que cambió es "price"

            if (Number(e.target.value) <= 0) {
            // ↑ Number(...) convierte el texto a número para poder compararlo
            //   Si el precio es menor o igual a 0 (ej: -5, 0, -100)...

                setPriceError('El precio debe ser mayor que cero.');
                // ↑ ...guardamos el mensaje de error para mostrarlo en pantalla

            } else {
                setPriceError('');
                // ↑ Si el precio es válido (mayor que 0), borramos el error
            }
        }
    }


    async function handleSubmit(e) {
    // ↑ Esta función se ejecuta cuando el usuario hace clic en "Crear" o "Actualizar"
    //   'async' significa que la función puede hacer operaciones que toman tiempo
    //   (como llamar al servidor)

        e.preventDefault();
        // ↑ Evita que el formulario recargue la página al enviarse
        //   (comportamiento por defecto del HTML que no queremos en React)

        if (Number(form.price) <= 0) {
        // ↑ Segunda línea de defensa: verificamos el precio justo antes de enviar
        //   Aunque handleChange ya lo valida mientras escribe, esto previene
        //   que se envíe si el campo quedó vacío ('') que se convierte a 0

            setPriceError('El precio debe ser mayor que cero.');
            return;
            // ↑ 'return' detiene la ejecución de la función aquí.
            //   Si hay error, NO continuamos con la llamada al servidor.
        }

        if (selectedProduct) {
            await updateProduct(selectedProduct.id, form);
            // ↑ Si hay producto seleccionado, actualizamos ese producto
            //   'await' significa "espera a que el servidor responda antes de continuar"
        } else {
            await createProduct(form);
            // ↑ Si no hay producto seleccionado, creamos uno nuevo
        }

        setForm({ name: '', price: '' });
        // ↑ Limpiamos el formulario después de guardar

        setPriceError('');
        // ↑ Limpiamos el error también

        onSaved();
        // ↑ Llamamos a la función que le avisa al componente padre (Products.jsx)
        //   que se guardó exitosamente, para que recargue la lista
    }


    return (
        <form onSubmit={handleSubmit}>
        {/* ↑ Cuando el usuario envíe el formulario, se ejecuta handleSubmit */}

            <div className='row g-3'>
            {/* ↑ Bootstrap: fila con espacio de 3 entre columnas */}

                <div className='col-md-5'>
                    <input
                        className='form-control'
                        name='name'
                        placeholder='Nombre del producto'
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    {/* ↑ Campo de texto para el nombre */}
                </div>

                <div className='col-md-4'>
                    <input
                        className={`form-control ${priceError ? 'is-invalid' : ''}`}
                        {/* ↑ Si hay error (priceError no está vacío), agregamos la clase
                              'is-invalid' de Bootstrap que pone el borde en rojo */}

                        name='price'
                        type='number'
                        {/* ↑ type='number' hace que el navegador solo acepte números */}

                        placeholder='Precio del producto'
                        value={form.price}
                        onChange={handleChange}
                        required
                    />

                    {priceError && (
                        <div className='invalid-feedback'>{priceError}</div>
                    )}
                    {/* ↑ Solo muestra este div si priceError tiene contenido.
                          'invalid-feedback' es una clase Bootstrap que muestra
                          texto en rojo debajo del input con error */}
                </div>

                <div className='col-md-3 d-flex gap-2'>
                    <button
                        type='submit'
                        className={`btn ${selectedProduct ? 'btn-warning' : 'btn-success'} w-100`}
                    >
                        {selectedProduct ? 'Actualizar' : 'Crear'}
                    </button>
                    {selectedProduct && (
                        <button
                            type='button'
                            className='btn btn-secondary w-100'
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
// ↑ Exportamos el componente para que otros archivos puedan importarlo
```

---

## ═══════════════════════════════════════════════
## MEJORA 2 — Barra de Navegación (Navbar)
## ═══════════════════════════════════════════════

### ¿Por qué necesitamos esto?
Ahora mismo no hay forma de navegar entre la página de Usuarios y Productos
sin escribir la URL manualmente. Un Navbar da al usuario botones/links para moverse.

### Archivo nuevo a crear: `src/components/Navbar.jsx`

---

### Código completo explicado línea por línea:

```jsx
import { Link } from 'react-router-dom';
// ↑ Importamos Link de react-router-dom
//   Link es como una etiqueta <a href="..."> de HTML puro, PERO con una diferencia:
//   NO recarga la página completa cuando el usuario hace clic.
//   En cambio, React Router cambia solo la parte de la página que necesita.
//   Esto se llama "Single Page Application" (SPA).


function Navbar() {
// ↑ Declaramos el componente Navbar. No recibe props porque no necesita
//   datos externos — su contenido es siempre el mismo.

    return (
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
        {/* ↑ <nav> es la etiqueta HTML semántica para menús de navegación
              navbar navbar-dark bg-dark → clases Bootstrap para barra oscura
              px-4                       → padding horizontal de 4
              d-flex                     → usa flexbox para alinear elementos
              justify-content-between   → separa los elementos (logo a la izquierda, links a la derecha)
              align-items-center        → centra verticalmente */}

            <span className="navbar-brand text-white fw-bold">
                🛒 MPS App
            </span>
            {/* ↑ El "logo" o nombre de la app en la parte izquierda del navbar */}

            <div className="d-flex gap-3">
            {/* ↑ Contenedor para los links, con espacio de 3 entre ellos */}

                <Link className="nav-link text-white" to="/">
                    Usuarios
                </Link>
                {/* ↑ Link a la ruta "/" → muestra el componente Users
                      nav-link text-white → clases Bootstrap para el estilo del link */}

                <Link className="nav-link text-white" to="/products">
                    Productos
                </Link>
                {/* ↑ Link a la ruta "/products" → muestra el componente Products */}

            </div>
        </nav>
    );
}

export default Navbar;
// ↑ Exportamos para poder usarlo en otros archivos
```

### Registrar el Navbar en el Router: `src/routes/AppRouter.jsx`

Para que el Navbar aparezca en **todas** las páginas, lo ponemos dentro del
`<BrowserRouter>` pero **fuera** del `<Routes>`. Así siempre se muestra,
sin importar en qué página esté el usuario.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ↑ BrowserRouter → el "envoltorio" que habilita la navegación sin recargar
//   Routes        → contenedor de todas las rutas
//   Route         → define una ruta individual (URL → componente)

import Users from '../pages/Users';
import Products from '../pages/Products';
import Navbar from '../components/Navbar';
// ↑ Importamos el Navbar que acabamos de crear


function AppRouter() {
    return (
        <BrowserRouter>
        {/* ↑ Todo lo que esté dentro de BrowserRouter puede usar Links y rutas */}

            <Navbar />
            {/* ↑ El Navbar va AQUÍ, fuera de <Routes>, para que aparezca en TODAS
                  las páginas. Si lo pusiéramos dentro de <Route>, solo aparecería
                  en esa página específica. */}

            <Routes>
            {/* ↑ React Router mirará la URL actual y mostrará el componente
                  cuya ruta coincida */}

                <Route path="/" element={<Users />} />
                {/* ↑ Cuando la URL sea "/" (la raíz), muestra el componente Users */}

                <Route path="/products" element={<Products />} />
                {/* ↑ Cuando la URL sea "/products", muestra el componente Products */}

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
```

---

## ═══════════════════════════════════════════════
## MEJORA 3 — Mensaje de Éxito (Toast)
## ═══════════════════════════════════════════════

### ¿Por qué necesitamos esto?
Cuando el usuario guarda o elimina un producto, la pantalla simplemente se
actualiza. No hay ningún aviso. Un "toast" es un mensaje temporal (como una
tostada que sale y desaparece) que confirma que la acción funcionó.

### Archivo a modificar: `src/pages/Products.jsx`

---

### Concepto clave: `setTimeout`

```js
setTimeout(() => {
    // código que se ejecuta después de un delay
}, 3000);
// ↑ 3000 = 3000 milisegundos = 3 segundos
```

`setTimeout` es como decirle a JavaScript: "espera 3 segundos y luego
ejecuta este código". Lo usaremos para que el toast desaparezca solo.

---

### Fragmento de código a agregar en Products.jsx:

```jsx
// 1. Agregar estado para el toast (junto a los otros useState)
const [toast, setToast] = useState('');
// ↑ Caja para el mensaje del toast
//   Si está vacía, no se muestra nada
//   Si tiene texto, se muestra el mensaje verde


// 2. Función helper para mostrar el toast
function showToast(msg) {
// ↑ Función reutilizable que podemos llamar desde cualquier parte del componente

    setToast(msg);
    // ↑ Guardamos el mensaje → React redibuja y aparece el toast en pantalla

    setTimeout(() => setToast(''), 3000);
    // ↑ Después de 3 segundos, borramos el mensaje → React redibuja y
    //   el toast desaparece solo. El usuario no tiene que cerrarlo.
}


// 3. Llamar showToast en handleSaved y handleDelete
function handleSaved() {
    setSelectedProduct(null);
    loadProducts();
    showToast('✅ Producto guardado correctamente.');
    // ↑ Cuando el formulario se guarda, mostramos el toast verde
}

async function handleDelete(id) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    await deleteProduct(id);
    loadProducts();
    showToast('🗑️ Producto eliminado correctamente.');
    // ↑ Cuando se elimina, también mostramos el toast
}


// 4. Mostrar el toast en el JSX (dentro del return)
{toast && (
    <div className="alert alert-success alert-dismissible" role="alert">
        {toast}
    </div>
)}
// ↑ {toast && (...)} es JSX condicional:
//   Si toast tiene contenido → muestra el div
//   Si toast está vacío ('')  → no muestra nada (porque '' es falsy en JS)
//
//   alert alert-success → clase Bootstrap para alerta verde
//   role="alert"        → accesibilidad: le dice al lector de pantalla que es un aviso
```

---

## ═══════════════════════════════════════════════
## MEJORA 4 — Búsqueda por Nombre
## ═══════════════════════════════════════════════

### ¿Por qué necesitamos esto?
Si tienes 100 productos, buscarlos visualmente en la tabla es muy lento.
Un input de búsqueda que filtra en tiempo real mejora mucho la experiencia.

### Archivo a modificar: `src/pages/Products.jsx`

---

### Concepto clave: `.filter()` con `.includes()` y `.toLowerCase()`

```js
// Ejemplo práctico:
const productos = [
    { name: 'Manzana' },
    { name: 'Mango' },
    { name: 'Pera' },
    { name: 'Naranja' },
];

const busqueda = 'man';

const resultado = productos.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
);
// resultado: [{ name: 'Manzana' }, { name: 'Mango' }]

// .toLowerCase() → convierte a minúsculas para que "MANGO" y "mango" sean iguales
// .includes()     → devuelve true si el texto contiene la búsqueda en cualquier posición
```

---

### Fragmento de código a agregar en Products.jsx:

```jsx
// 1. Agregar estado para la búsqueda
const [search, setSearch] = useState('');
// ↑ Caja que guarda el texto que el usuario escribe en el buscador
//   Empieza vacío = no hay filtro = se muestran todos los productos


// 2. Crear la lista filtrada (DERIVADA del estado)
const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
);
// ↑ Esta línea CREA una nueva lista derivada de 'products'
//   No modifica el array original 'products', solo crea una vista filtrada.
//
//   p.name.toLowerCase()        → nombre del producto en minúsculas
//   .includes(search.toLowerCase()) → ¿contiene el texto de búsqueda?
//
//   Ejemplos:
//   search = ''       → todos los productos (todos incluyen '')
//   search = 'ca'     → solo productos cuyo nombre contenga 'ca': 'Camiseta', 'Calcetines'
//   search = 'CAM'    → mismo resultado (gracias a toLowerCase)


// 3. Input de búsqueda en el JSX
<input
    className="form-control w-50"
    // ↑ form-control → estilo Bootstrap para inputs
    //   w-50         → ancho del 50% del contenedor

    placeholder="Buscar por nombre..."
    // ↑ Texto gris que aparece cuando el input está vacío

    value={search}
    // ↑ El valor del input está CONTROLADO por React.
    //   El input muestra exactamente lo que hay en la caja 'search'.

    onChange={e => setSearch(e.target.value)}
    // ↑ Cada vez que el usuario escribe una letra, actualizamos 'search'
    //   e.target.value → el texto completo que hay en el input en ese momento
    //   Al cambiar 'search', React recalcula 'filteredProducts' y redibuja la tabla
/>


// 4. En la tabla, usar filteredProducts en lugar de products
{filteredProducts.map((p) => (
    <tr key={p.id}>
    {/* ... */}
    </tr>
))}
// ↑ Ahora iteramos sobre la lista FILTRADA en lugar de la lista completa
//   Cuando search está vacío → filteredProducts === products (se muestran todos)
//   Cuando search tiene texto → filteredProducts es un subconjunto filtrado
```

---

## 📋 Resumen de todos los archivos modificados / creados

| Archivo | Qué se hizo |
|---------|------------|
| `src/components/productForm.jsx` | + Estado `priceError` + Validación en `handleChange` y `handleSubmit` + Clase `is-invalid` en input + `<div class="invalid-feedback">` |
| `src/components/Navbar.jsx` | **NUEVO** — Componente con links a `/` y `/products` |
| `src/routes/AppRouter.jsx` | + Import de Navbar + `<Navbar />` encima de `<Routes>` |
| `src/pages/Products.jsx` | + Estado `toast` + Estado `search` + Función `showToast()` + `filteredProducts` + Input de búsqueda + Toast en JSX + Fix: `windows.confirm` → `window.confirm` |

---

## 🧪 Cómo probar cada mejora

### Prueba 1 — Validación de precio
1. Ve a `/products`
2. En el formulario, escribe un nombre y pon `-5` como precio
3. ✅ Deberías ver el input en rojo con el texto "El precio debe ser mayor que cero."
4. Intenta hacer clic en "Crear" → ❌ No debe enviar el formulario

### Prueba 2 — Navbar
1. Carga la app (cualquier página)
2. ✅ Deberías ver la barra oscura en la parte superior a siempre
3. Haz clic en "Productos" → va a `/products`
4. Haz clic en "Usuarios" → va a `/`
5. ✅ La página NO se recarga completa (nótalo en el estado del formulario)

### Prueba 3 — Toast de éxito
1. Ve a `/products`
2. Crea un producto con nombre y precio válidos → clic en "Crear"
3. ✅ Debe aparecer un recuadro verde con "Producto guardado correctamente."
4. Espera 3 segundos → ✅ El mensaje desaparece solo
5. Elimina un producto → ✅ Aparece el mensaje de eliminación

### Prueba 4 — Búsqueda
1. Ve a `/products` (asegúrate de tener varios productos)
2. Escribe "cam" en el buscador
3. ✅ Solo se muestran los productos cuyo nombre contiene "cam"
4. Borra el texto → ✅ Se vuelven a mostrar todos

---

## 🎯 Diagrama de flujo del componente Products.jsx

```
Usuario escribe en buscador
        ↓
  setSearch(nuevo texto)
        ↓
React recalcula filteredProducts
  = products.filter(...)
        ↓
  Re-renderiza la tabla
  con solo los resultados
```

```
Usuario guarda producto
        ↓
  handleSubmit (en ProductForm)
        ↓
  createProduct / updateProduct → servidor
        ↓
  onSaved() (callback al padre)
        ↓
  handleSaved() (en Products.jsx)
  ├─ setSelectedProduct(null)
  ├─ loadProducts()
  └─ showToast('✅ Guardado...')
         ↓
  setTimeout 3 seg → setToast('')
```

---

*Guía generada para el proyecto mps-frontend — React + Vite + Bootstrap*
