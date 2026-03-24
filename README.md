# Sistema de Gestión de Usuarios

Guía técnica completa para construir este proyecto desde cero.  
Al seguir cada paso obtendrás una aplicación React funcional al 100% que consume una API REST con operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) sobre usuarios, con estilos Bootstrap 5.

---

## Índice

1. [¿Qué vamos a construir?](#1-qué-vamos-a-construir)
2. [Requisitos previos](#2-requisitos-previos)
3. [Crear el proyecto con Vite](#3-crear-el-proyecto-con-vite)
4. [Instalar dependencias](#4-instalar-dependencias)
5. [Añadir Bootstrap 5](#5-añadir-bootstrap-5)
6. [Estructura de carpetas](#6-estructura-de-carpetas)
7. [Archivo por archivo — explicación línea a línea](#7-archivo-por-archivo--explicación-línea-a-línea)
   - [main.jsx](#71-mainjsx)
   - [App.jsx](#72-appjsx)
   - [routes/AppRouter.jsx](#73-routesapprouterjsx)
   - [api/user.api.js](#74-apiuserapijs)
   - [components/UserForm.jsx](#75-componentsuserformjsx)
   - [pages/Users.jsx](#76-pagesUsersjsx)
8. [La API REST esperada](#8-la-api-rest-esperada)
9. [Ejecutar el proyecto](#9-ejecutar-el-proyecto)
10. [Conceptos clave explicados](#10-conceptos-clave-explicados)

---

## 1. ¿Qué vamos a construir?

Una SPA (Single Page Application) en React que:

- **Lista** todos los usuarios registrados en una tabla.
- **Crea** nuevos usuarios mediante un formulario.
- **Edita** un usuario existente (el formulario se pre-rellena al hacer clic en "Editar").
- **Elimina** un usuario con confirmación previa.

La aplicación se comunica con una API REST externa en `http://localhost:3000/api/users`.

---

## 2. Requisitos previos

| Herramienta | Versión mínima | Para qué sirve |
|---|---|---|
| Node.js | 18+ | Ejecutar JavaScript fuera del navegador y gestionar paquetes con npm |
| npm | 9+ | Instalar librerías (viene incluido con Node.js) |
| Editor | VS Code recomendado | Escribir el código |
| API backend | Corriendo en puerto 3000 | Proveer los datos de usuarios |

Verifica que tienes Node instalado:

```bash
node -v
npm -v
```

---

## 3. Crear el proyecto con Vite

**Vite** es una herramienta moderna que crea y arranca proyectos React muy rápido.

```bash
npm create vite@latest mps-frontend -- --template react
cd mps-frontend
npm install
```

**¿Por qué Vite y no Create React App?**  
Vite es más rápido en desarrollo, usa ES Modules nativos del navegador y tiene una configuración más sencilla.

---

## 4. Instalar dependencias

```bash
npm install axios react-router-dom
```

| Paquete | ¿Qué hace? | ¿Por qué lo necesitamos? |
|---|---|---|
| `axios` | Realiza peticiones HTTP (GET, POST, PUT, DELETE) | Es más cómodo que `fetch`: maneja errores mejor y parsea JSON automáticamente |
| `react-router-dom` | Gestiona la navegación entre páginas sin recargar el navegador | Permite crear rutas tipo `/`, `/usuarios`, etc. en una SPA |

---

## 5. Añadir Bootstrap 5

No instalamos Bootstrap como paquete npm — lo cargamos desde CDN para mantener el proyecto simple.

Edita `index.html` para que quede exactamente así:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />

    <!-- viewport: hace que el diseño sea responsivo en pantallas pequeñas -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>MPS - Sistema de Usuarios</title>

    <!-- Bootstrap 5: estilos CSS cargados desde internet (CDN).       -->
    <!-- Sin esto, los className="btn btn-primary" no tienen estilo.   -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    />
  </head>
  <body>
    <!-- React montará toda la aplicación dentro de este div -->
    <div id="root"></div>

    <!-- Punto de entrada del código JavaScript de React -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**¿Por qué `lang="es"`?** Indica al navegador que el contenido está en español (buenas prácticas de accesibilidad y SEO).

---

## 6. Estructura de carpetas

Crea exactamente esta estructura dentro de `src/`:

```
mps-frontend/
├── index.html              ← HTML base, único archivo HTML del proyecto
├── package.json            ← Dependencias y scripts del proyecto
├── vite.config.js          ← Configuración de Vite (no modificar)
└── src/
    ├── main.jsx            ← Punto de entrada: monta React en el DOM
    ├── App.jsx             ← Componente raíz: carga el enrutador
    ├── index.css           ← Estilos globales opcionales (puede estar vacío)
    ├── api/
    │   └── user.api.js     ← Todas las llamadas HTTP a la API de usuarios
    ├── components/
    │   └── UserForm.jsx    ← Formulario reutilizable (crear y editar)
    ├── pages/
    │   └── Users.jsx       ← Página principal: lista + formulario
    └── routes/
        └── AppRouter.jsx   ← Definición de rutas de la aplicación
```

**Regla de organización:**
- `api/` → todo lo que se comunica con el servidor.
- `components/` → piezas de UI reutilizables (pueden usarse en varias páginas).
- `pages/` → vistas completas, una por ruta.
- `routes/` → configuración de navegación.

---

## 7. Archivo por archivo — explicación línea a línea

### 7.1 `main.jsx`

Es el **punto de entrada** de la aplicación. Vite lo ejecuta primero.

```jsx
// StrictMode: componente especial de React que activa advertencias extra
// durante el desarrollo para ayudarte a encontrar errores potenciales.
// NO afecta al comportamiento ni al resultado en producción.
import { StrictMode } from 'react'

// createRoot: función moderna de React 18+ para montar la aplicación.
// Reemplaza al antiguo ReactDOM.render() de React 17.
import { createRoot } from 'react-dom/client'

// Importa los estilos globales. Puede estar vacío; lo dejamos por si
// queremos añadir estilos personalizados en el futuro.
import './index.css'

// Importa el componente raíz de la aplicación
import App from './App.jsx'

// document.getElementById('root') → busca el <div id="root"> en index.html
// createRoot(...)                 → prepara React para controlar ese div
// .render(...)                    → dibuja el árbol de componentes dentro del div
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />   {/* Todo el árbol de componentes empieza aquí */}
  </StrictMode>,
)
```

---

### 7.2 `App.jsx`

Componente raíz. Su única responsabilidad es delegar al enrutador.

```jsx
// Importa el componente que contiene todas las rutas de la aplicación
import AppRouter from './routes/AppRouter';

// Todo componente React es una función que devuelve JSX
function App() {
  // Delega el control al enrutador
  return <AppRouter />;
}

// export default → permite importar este componente con:
// import App from './App'   (sin llaves)
export default App;
```

**¿Por qué no poner las rutas directamente aquí?**  
Separar rutas en `AppRouter` mantiene `App.jsx` limpio. Si mañana agregas 10 rutas o una barra de navegación, `App.jsx` no cambia.

---

### 7.3 `routes/AppRouter.jsx`

Define qué componente se muestra según la URL del navegador.

```jsx
// BrowserRouter → activa el sistema de rutas usando la API de historial
//                 del navegador. Las URLs se ven limpias: /usuarios (no /#/usuarios)
// Routes        → contenedor de rutas. Evalúa de arriba hacia abajo
//                 y muestra solo la primera que coincide con la URL actual.
// Route         → una regla individual: si la URL coincide con `path`,
//                 renderiza el `element` indicado.
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa la única página que tenemos por ahora
import Users from '../pages/Users';

function AppRouter() {
  return (
    // BrowserRouter debe envolver todo el árbol de rutas.
    // Activa el contexto de navegación para todos los componentes hijos.
    <BrowserRouter>

      {/* Routes: solo renderiza la ruta que coincide con la URL actual */}
      <Routes>

        {/* path="/"         → coincide con localhost:5173/          */}
        {/* element={<Users />} → renderiza el componente Users       */}
        <Route path="/" element={<Users />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

---

### 7.4 `api/user.api.js`

Centraliza **todas** las llamadas HTTP. Ningún otro archivo escribe URLs directamente.

```js
// axios es la librería que realiza las peticiones HTTP.
// Devuelve Promises con { data, status, headers, ... }
import axios from 'axios';

// URL base de la API.
// Al tenerla en una constante, si el servidor cambia (ej: de puerto 3000 a 8000)
// solo modificamos esta línea y todo el proyecto se actualiza automáticamente.
const API = 'http://localhost:3000/api/users';

// GET /api/users
// Devuelve una Promise. El llamador usa `await` para esperar la respuesta.
// La respuesta estará en res.data (axios extrae automáticamente el JSON)
export const getUsers = () => axios.get(API);

// GET /api/users/:id
// Template literal `${API}/${id}` construye la URL con el id dinámicamente.
// Ejemplo: getUserById(3) → GET http://localhost:3000/api/users/3
export const getUserById = (id) => axios.get(`${API}/${id}`);

// POST /api/users
// `data` debe ser un objeto: { name: "Juan", email: "juan@ejemplo.com" }
// axios.post serializa automáticamente el objeto a JSON y añade el
// header Content-Type: application/json
export const createUser = (data) => axios.post(API, data);

// PUT /api/users/:id
// Reemplaza todos los campos del usuario con los nuevos datos.
// Ejemplo: updateUser(3, { name: "Juan Actualizado", email: "nuevo@mail.com" })
export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);

// DELETE /api/users/:id
// Elimina permanentemente el usuario con ese id.
// Ejemplo: deleteUser(3) → DELETE http://localhost:3000/api/users/3
export const deleteUser = (id) => axios.delete(`${API}/${id}`);
```

---

### 7.5 `components/UserForm.jsx`

Formulario **controlado** que sirve tanto para crear como para editar usuarios.

```jsx
import { useState, useEffect } from 'react';
import { createUser, updateUser } from '../api/user.api';

// Props que recibe este componente desde Users.jsx:
//   onSaved      → función a ejecutar cuando se guarda correctamente
//   selectedUser → objeto { id, name, email } en modo edición, o null en modo creación
//   onCancelEdit → función para abandonar el modo edición
function UserForm({ onSaved, selectedUser, onCancelEdit }) {

  // Estado del formulario: contiene los valores actuales de los campos.
  // "Formulario controlado" = React controla el valor de cada input.
  // Cada vez que el usuario escribe, React actualiza el estado y re-renderiza.
  const [form, setForm] = useState({ name: '', email: '' });

  // useEffect se ejecuta DESPUÉS de cada render en el que `selectedUser` cambie.
  // Propósito: sincronizar el formulario con el usuario seleccionado.
  //   - Si selectedUser tiene datos → pre-rellena los inputs (modo edición)
  //   - Si selectedUser es null     → limpia los inputs (modo creación)
  useEffect(() => {
    if (selectedUser) {
      setForm({ name: selectedUser.name, email: selectedUser.email });
    } else {
      setForm({ name: '', email: '' });
    }
  }, [selectedUser]); // ← se re-ejecuta cada vez que selectedUser cambia

  // Se dispara con cada tecla que el usuario escribe en cualquier input.
  // e.target.name  → el atributo `name` del input que disparó el evento ("name" o "email")
  // e.target.value → el texto actual del input
  // ...form → spread: copia todos los campos actuales del estado
  // [e.target.name]: e.target.value → actualiza solo el campo que cambió
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Se ejecuta cuando el usuario hace clic en "Guardar" o "Actualizar".
  async function handleSubmit(e) {
    // preventDefault() impide el comportamiento por defecto del formulario:
    // sin esto, el navegador recargaría la página al enviar el form.
    e.preventDefault();

    if (selectedUser) {
      // Modo edición: actualizamos el usuario usando su id
      await updateUser(selectedUser.id, form);
    } else {
      // Modo creación: enviamos los datos del formulario como nuevo usuario
      await createUser(form);
    }

    // Limpia el formulario tras guardar exitosamente
    setForm({ name: '', email: '' });

    // Notifica al componente padre (Users.jsx) para que recargue la lista
    onSaved();
  }

  return (
    // onSubmit conecta el evento "submit" del formulario con handleSubmit
    <form onSubmit={handleSubmit}>

      {/* Bootstrap: row crea una fila; g-3 añade separación entre columnas */}
      <div className="row g-3">

        {/* col-md-5: ocupa 5 de 12 columnas en pantallas medianas y grandes */}
        <div className="col-md-5">
          <input
            className="form-control"  {/* Bootstrap: estiliza el input con bordes y padding */}
            name="name"               {/* debe coincidir con la clave en el estado `form` */}
            placeholder="Nombre"
            value={form.name}         {/* valor controlado: React controla lo que muestra el input */}
            onChange={handleChange}   {/* actualiza el estado al escribir */}
            required                  {/* HTML5: el navegador bloquea el envío si está vacío */}
          />
        </div>

        <div className="col-md-5">
          <input
            className="form-control"
            type="email"              {/* HTML5: valida formato email antes de enviar */}
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* col-md-2: columna estrecha para botones */}
        {/* d-flex: display flex (botones en fila) */}
        {/* gap-2: separación entre botones */}
        <div className="col-md-2 d-flex gap-2">

          {/* Botón dinámico: azul (btn-primary) para crear, amarillo (btn-warning) para editar */}
          <button
            type="submit"
            className={`btn ${selectedUser ? 'btn-warning' : 'btn-primary'} w-100`}
          >
            {/* Texto dinámico según el modo actual */}
            {selectedUser ? 'Actualizar' : 'Guardar'}
          </button>

          {/* Renderizado condicional: el botón Cancelar SOLO aparece en modo edición */}
          {selectedUser && (
            <button
              type="button"              {/* IMPORTANTE: sin type="button", haría submit al formulario */}
              className="btn btn-secondary w-100"
              onClick={onCancelEdit}     {/* avisa al padre para limpiar selectedUser */}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default UserForm;
```

---

### 7.6 `pages/Users.jsx`

Página principal. **Orquesta** el formulario y la tabla: gestiona el estado global de la vista y delega a los componentes hijos.

```jsx
import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../api/user.api';
import UserForm from '../components/UserForm';

function Users() {

  // users: array con todos los usuarios cargados de la API.
  // Valor inicial: array vacío (antes de que llegue la respuesta)
  const [users, setUsers] = useState([]);

  // selectedUser: el usuario que se está editando actualmente.
  // null = modo creación | objeto { id, name, email } = modo edición
  const [selectedUser, setSelectedUser] = useState(null);

  // useEffect con dependencias vacías [] → se ejecuta UNA sola vez
  // cuando el componente se monta en el DOM (equivale a "al cargar la página").
  // Efecto: carga la lista de usuarios al iniciar.
  useEffect(() => {
    loadUsers();
  }, []);

  // Llama a la API, recibe los datos y los guarda en el estado.
  // Como modifica el DOM (a través de setUsers), React re-renderiza la tabla.
  async function loadUsers() {
    const res = await getUsers();
    const data = res.data; // axios guarda el JSON de la respuesta en .data

    // Compatibilidad con APIs que devuelven arrays en lugar de objetos:
    //   Formato array:  [[1, "Juan", "juan@mail.com"], [2, "Ana", "ana@mail.com"]]
    //   Formato objeto: [{ id: 1, name: "Juan", email: "juan@mail.com" }, ...]
    // Esta condición detecta el formato array y lo convierte a objetos
    // para que el resto del código siempre trabaje con propiedades nombradas.
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      setUsers(data.map((u) => ({ id: u[0], name: u[1], email: u[2] })));
    } else {
      setUsers(data); // la API ya devuelve objetos: los usamos directamente
    }
  }

  // Pide confirmación antes de borrar para evitar eliminaciones accidentales.
  // window.confirm devuelve true si el usuario acepta, false si cancela.
  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este usuario?')) return; // sale sin hacer nada si cancela
    await deleteUser(id);
    loadUsers(); // recarga la lista para reflejar el cambio
  }

  // Al hacer clic en "Editar":
  // Guarda el objeto usuario en el estado → useEffect en UserForm
  // detecta el cambio y pre-rellena los inputs automáticamente.
  function handleEdit(user) {
    setSelectedUser(user);
  }

  // Al hacer clic en "Cancelar" en el formulario:
  // Limpia la selección → useEffect en UserForm limpia los inputs.
  function handleCancelEdit() {
    setSelectedUser(null);
  }

  // Callback que recibe UserForm cuando guarda exitosamente:
  // 1. Limpia la selección (vuelve a modo creación)
  // 2. Recarga la lista para mostrar los cambios
  function handleSaved() {
    setSelectedUser(null);
    loadUsers();
  }

  return (
    // container: centra el contenido con márgenes laterales automáticos
    // py-4: padding vertical (arriba y abajo) de 1.5rem
    <div className="container py-4">

      <h2 className="mb-4">Gestión de Usuarios</h2>

      {/* ── TARJETA DEL FORMULARIO ── */}
      {/* mb-4: margen inferior para separar la tarjeta de la tabla */}
      <div className="card mb-4">

        {/* card-header: encabezado de la tarjeta.                             */}
        {/* Muestra texto dinámico según si estamos creando o editando.        */}
        <div className="card-header">
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </div>

        <div className="card-body">
          {/* Pasa las 3 props necesarias al formulario:                        */}
          {/*   onSaved      → qué hacer cuando se guarda                       */}
          {/*   selectedUser → el usuario a editar (null si es creación nueva)  */}
          {/*   onCancelEdit → qué hacer cuando se cancela la edición           */}
          <UserForm
            onSaved={handleSaved}
            selectedUser={selectedUser}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>

      {/* ── TARJETA DE LA TABLA ── */}
      <div className="card">
        <div className="card-header">Lista de Usuarios</div>

        {/* p-0: quita el padding para que la tabla llegue a los bordes */}
        <div className="card-body p-0">

          {/* table-striped: filas alternas con fondo gris (mejora legibilidad) */}
          {/* table-hover:   resalta la fila al pasar el cursor por encima      */}
          {/* mb-0:          elimina el margen inferior por defecto de Bootstrap */}
          <table className="table table-striped table-hover mb-0">

            <thead className="table-dark"> {/* cabecera con fondo oscuro */}
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {/* Renderizado condicional:                                    */}
              {/* Si no hay usuarios → muestra una fila con mensaje.         */}
              {/* Si hay usuarios → genera una fila por cada uno con .map()  */}
              {users.length === 0 ? (
                <tr>
                  {/* colSpan="4": la celda se extiende por las 4 columnas */}
                  <td colSpan="4" className="text-center text-muted py-3">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                // .map() transforma el array de objetos en elementos JSX.
                // key={u.id}: React necesita una clave única por elemento en
                // listas para identificar qué filas cambiaron y actualizar
                // el DOM de forma eficiente. NUNCA uses el índice como key
                // si el orden puede cambiar.
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {/* me-2: margin-right para separar los botones */}
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(u)} {/* pasa el objeto completo */}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)} {/* pasa solo el id */}
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
```

---

## 8. La API REST esperada

El frontend espera que el backend corra en `http://localhost:3000` y exponga:

| Método | Endpoint | Descripción | Body requerido |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Obtener todos los usuarios | — |
| GET | `/api/users/:id` | Obtener un usuario por ID | — |
| POST | `/api/users` | Crear un usuario | `{ "name": "...", "email": "..." }` |
| PUT | `/api/users/:id` | Actualizar un usuario | `{ "name": "...", "email": "..." }` |
| DELETE | `/api/users/:id` | Eliminar un usuario | — |

**Ejemplo de respuesta esperada de `GET /api/users`:**

```json
[
  { "id": 1, "name": "Juan Pérez", "email": "juan@ejemplo.com" },
  { "id": 2, "name": "Ana García", "email": "ana@ejemplo.com" }
]
```

> El frontend también soporta que la API devuelva arrays `[id, name, email]` en lugar de objetos, gracias a la normalización en `loadUsers()`.

---

## 9. Ejecutar el proyecto

### Paso 1: Instalar dependencias

```bash
npm install
```

Este comando lee `package.json` y descarga todas las librerías a la carpeta `node_modules/`.

### Paso 2: Asegurarte de que la API esté corriendo

La API debe estar disponible en `http://localhost:3000` antes de iniciar el frontend. Sin ella, la lista de usuarios aparecerá vacía y las operaciones fallarán.

### Paso 3: Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173` — verás la aplicación funcionando.

### Otros comandos útiles

```bash
npm run build    # Genera la versión optimizada de producción en la carpeta dist/
npm run preview  # Sirve localmente la versión de producción para pruebas finales
npm run lint     # Revisa errores de código con ESLint (buenas prácticas)
```

---

## 10. Conceptos clave explicados

### ¿Qué es un componente?
Una función JavaScript que devuelve JSX. Es el bloque básico de React. Cada componente tiene su propio estado y puede recibir datos de su padre mediante **props**.

### ¿Qué es el estado (`useState`)?
Una variable que React "vigila". Cuando cambia, React re-dibuja automáticamente el componente. **Nunca modifiques el estado directamente** — siempre usa la función setter.

```jsx
const [users, setUsers] = useState([]); // valor inicial: array vacío
// users    → el valor actual
// setUsers → la función para actualizarlo
setUsers([...users, nuevoUsuario]); // CORRECTO
users.push(nuevoUsuario);           // INCORRECTO: React no detecta el cambio
```

### ¿Qué es `useEffect`?
Un hook para ejecutar código con **efectos secundarios** (llamadas a APIs, suscripciones, etc.) después de que React renderiza el componente.

```jsx
useEffect(() => {
  loadUsers(); // se ejecuta después del primer render
}, []);        // [] vacío = solo una vez, al montar el componente
               // [variable] = cada vez que `variable` cambie
               // sin array = en cada render (raramente deseable)
```

### ¿Qué es JSX?
La sintaxis que mezcla HTML y JavaScript. Reglas principales:
- Usa `className` en lugar de `class` (porque `class` es palabra reservada en JS).
- Todas las etiquetas deben cerrarse: `<input />`, no `<input>`.
- Las expresiones JavaScript van entre llaves `{}`: `{user.name}`, `{2 + 2}`.
- Solo puedes devolver **un elemento raíz** por componente (usa `<>...</>` si necesitas agrupar sin añadir un div).

### ¿Qué son las props?
Los parámetros que un componente padre pasa a un componente hijo. Son de **solo lectura**: el hijo nunca debe modificar sus props.

```jsx
// Padre envía datos:
<UserForm onSaved={handleSaved} selectedUser={selectedUser} />

// Hijo los recibe como parámetros de la función:
function UserForm({ onSaved, selectedUser }) { ... }
```

### ¿Por qué `async/await`?
Las llamadas HTTP tardan tiempo (van por la red). `async/await` permite esperar la respuesta antes de continuar, escribiendo código legible como si fuera síncrono.

```js
// SIN await: intenta usar la respuesta antes de que llegue → undefined
const res = getUsers();
console.log(res.data); // ERROR: res es una Promise, no la respuesta

// CON await: espera a que la Promise se resuelva
const res = await getUsers();
console.log(res.data); // CORRECTO: ya tiene los datos
```

### ¿Qué es axios y `res.data`?
Axios es la librería HTTP. Cada llamada devuelve una Promise que resuelve en un objeto con esta estructura:

```js
{
  data: [...],    // ← los datos reales de la API (lo que devuelve el servidor)
  status: 200,    // código HTTP
  headers: {...}  // cabeceras de la respuesta
}
```

Por eso siempre accedemos con `res.data`.

---

## Flujo completo de datos

```
Usuario escribe en el formulario
  → handleChange() actualiza el estado `form`
    → React re-renderiza los inputs con los nuevos valores

Usuario hace clic en "Guardar"
  → handleSubmit() en UserForm
    → createUser(form) en user.api.js
      → axios.post('http://localhost:3000/api/users', form)
        → API REST guarda en base de datos
        → responde con el usuario creado (status 201)
    → onSaved() → handleSaved() en Users.jsx
      → setSelectedUser(null)  → formulario vuelve a modo "Nuevo"
      → loadUsers()            → getUsers() trae lista actualizada
        → setUsers(data)       → React re-renderiza la tabla
          → nueva fila aparece en la tabla
```
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
