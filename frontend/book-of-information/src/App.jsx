import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [pages, setPages] = useState([]); // Lista de páginas desde la base de datos
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [selectedPage, setSelectedPage] = useState(null); // Página seleccionada para edición
  const [editedText, setEditedText] = useState(""); 
  const [title, setTitle] = useState(""); // Para crear nueva página
  const [newText, setNewText] = useState(""); // Para crear nueva página
  const [category, setCategory] = useState(""); // Para crear nueva página
  const [message, setMessage] = useState(""); // Mensajes de estado
  const [viewMode, setViewMode] = useState("select"); // Modo de vista: "select" o "create"

  // Obtener las páginas desde el backend
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pages/all');
        setPages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las páginas:', error);
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Crear nueva página
  const handleCreatePage = async (e) => {
    e.preventDefault();

    if (!title || !newText || !category) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/pages/create', {
        title,
        text: newText,
        category,
      });

      setMessage("Página creada con éxito: " + response.data.page.title);
      setPages([...pages, response.data.page]); // Añadir la nueva página a la lista
      setTitle("");
      setNewText("");
      setCategory("");
    } catch (error) {
      console.error('Error al crear la página:', error.response?.data || error.message);
      setMessage("Error al crear la página.");
    }
  };

  // Seleccionar una página para editar
  const handleSelectPage = (page) => {
    setSelectedPage(page); 
    setEditedText(page.text); 
  };
  const handleDelete = async () => {
    if (!selectedPage) {
      alert('Ninguna página seleccionada para eliminar');
      return;
    }
  
    try {
      // Hacer la solicitud DELETE al backend
      const response = await axios.delete(`http://localhost:5000/api/pages/delete/${selectedPage._id}`);
      
      alert('Página eliminada correctamente');
      console.log(response.data);
  
      // Actualizar la lista de páginas eliminando la seleccionada
      const updatedPages = pages.filter((page) => page._id !== selectedPage._id);
      setPages(updatedPages);
      setSelectedPage(null); // Limpiar la selección
    } catch (error) {
      console.error('Error al eliminar la página:', error.response?.data || error.message);
      alert('Hubo un problema al eliminar la página.');
    }
  };
  
  // Guardar cambios en la página seleccionada
  const handleSave = async () => {
    if (!selectedPage) {
      alert("Selecciona una página antes de confirmar.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/pages/${selectedPage._id}`, {
        text: editedText, 
      });

      alert("Texto actualizado correctamente");
      console.log(response.data);
     
      const updatedPages = pages.map((page) =>
        page._id === selectedPage._id ? { ...page, text: editedText } : page
      );
      setPages(updatedPages); 
    } catch (error) {
      console.error("Error al guardar los cambios:", error.response?.data || error.message);
      alert("Hubo un problema al guardar los cambios.");
    }
  };

  if (loading) return <p>Cargando páginas...</p>;

  return (
    <div>
      <header className="navbar">
      <button onClick={handleDelete} disabled={!selectedPage || viewMode !== "select"}>eliminar pagina</button>
        <button onClick={() => setViewMode("select")}>
          Seleccionar Página
        </button>
        <button onClick={() => setViewMode("create")}>
          Crear Página
        </button>
        <button onClick={handleSave} disabled={!selectedPage || viewMode !== "select"}>
          Confirmar
        </button>
      </header>

      <div className="layout">
        <aside className="aside-list">
          <h1>Lista de Páginas</h1>
          <ul>
            {pages.map((page) => (
              <li key={page._id}>
                <button onClick={() => handleSelectPage(page)}>
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="hero">
          {viewMode === "select" ? (
            selectedPage ? (
              <>
                <h2>Editando: {selectedPage.title}</h2>
                <textarea
                  rows={10}
                  cols={80}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              </>
            ) : (
              <p>Selecciona una página de la lista para editarla.</p>
            )
          ) : (
            <>
              <h2>Crear Nueva Página</h2>
              <form onSubmit={handleCreatePage}>
                <div>
                  <label>Título:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Texto:</label>
                  <textarea
                    rows={5}
                    cols={50}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                </div>
                <div>
                  <label>Categoría:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <button type="submit">Crear Página</button>
              
              </form>
              {message && <p>{message}</p>}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
