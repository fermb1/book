import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [pages, setPages] = useState([]); // Lista de páginas desde la base de datos
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [selectedPage, setSelectedPage] = useState(null); // Página seleccionada para edición
  const [editedText, setEditedText] = useState(""); // Texto editable

  // Fetch inicial para obtener las páginas
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pages/all'); // Asegúrate de que esta ruta esté correcta en tu backend
        setPages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las páginas:', error);
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Seleccionar una página
  const handleSelectPage = (page) => {
    setSelectedPage(page); // Establece la página seleccionada
    setEditedText(page.text); // Establece el texto editable con el texto actual
  };

  // Guardar los cambios en el backend
  const handleSave = async () => {
    if (!selectedPage) {
      alert("Selecciona una página antes de confirmar.");
      return;
    }
  
    try {
      // Enviar solicitud PUT para actualizar la página con el nuevo texto
      const response = await axios.put(`http://localhost:5000/api/pages/${selectedPage._id}`, {
        text: editedText, // El texto editado
      });
      alert("Texto actualizado correctamente");
      console.log(response.data);
      // Actualizar la lista de páginas con los cambios
      const updatedPages = pages.map((page) =>
        page._id === selectedPage._id ? { ...page, text: editedText } : page
      );
      setPages(updatedPages); // Actualizamos la lista local de páginas
    } catch (error) {
      console.error("Error al guardar los cambios:", error.response?.data || error.message);
      alert("Hubo un problema al guardar los cambios.");
    }
  };

  if (loading) return <p>Cargando páginas...</p>;

  return (
    <div>
      <header className="navbar">
        <button onClick={handleSave} disabled={!selectedPage}>
          Confirmar
        </button>
      </header>
      <div className="layout">
        <aside className="aside-list">
          <h1>Lista de páginas</h1>
          <ul>
            {pages.map((page) => (
              <li key={page._id}>
                <button onClick={() => handleSelectPage(page)}>
                  {page.title}
                </button>
                <small>Categoría: {page.category}</small>
              </li>
            ))}
          </ul>
        </aside>
        <section className="hero">
          {selectedPage ? (
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
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
