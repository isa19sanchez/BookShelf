// ================= URL DE TU SERVIDOR API =================
const API_URL = 'https://bookshelf-7u19.onrender.com/api/books';

// El array de libros ahora empieza vacío y se llenará desde la base de datos
let books = [];
let currentFilter = 'Todos';
let selectedBookId = null;

// ================= ELEMENTOS DEL DOM =================
const booksGrid = document.getElementById('booksGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Modales
const detailModal = document.getElementById('detailModal');
const deleteModal = document.getElementById('deleteModal');
const addBookModal = document.getElementById('addBookModal');

// Formularios / Inputs
const addBookForm = document.getElementById('addBookForm');
const openAddModalBtn = document.getElementById('openAddModalBtn');

// Botones de cierre/confirmación
const closeDetailBtn = document.getElementById('closeDetailBtn');
const closeAddModalBtn = document.getElementById('closeAddModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// ================= LLAMADAS ASÍNCRONAS A LA API (fetch) =================

// 1. OBTENER LIBROS: Carga la lista directamente de MySQL
async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al conectar con la API');
    
    books = await response.json();
    renderBooks();
  } catch (error) {
    console.error('❌ Error cargando libros:', error);
    booksGrid.innerHTML = `<p class="no-books">Error al conectar con el servidor. Revisa si "node server.js" está corriendo.</p>`;
  }
}

// ================= RENDERIZADO DE LA GALERÍA =================
function renderBooks() {
  booksGrid.innerHTML = '';
  
  const filteredBooks = books.filter(book => {
    if (currentFilter === 'Todos') return true;
    return book.status === currentFilter;
  });

  if (filteredBooks.length === 0) {
    booksGrid.innerHTML = `<p class="no-books">No hay libros en esta sección.</p>`;
    return;
  }

  filteredBooks.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.dataset.id = book.id;

    // Colores de etiquetas de estado
    let statusClass = 'status-leyendo';
    if (book.status === 'Pendiente') statusClass = 'status-pendiente';
    if (book.status === 'Terminado') statusClass = 'status-terminado';

    // Carga de imagen de portada (Wikipedia/Libre o un Placeholder si falla)
    const coverSrc = book.cover || 'https://via.placeholder.com/150x220/e0e0e0/666666?text=Sin+Portada';

    // Estructura HTML interna de la tarjeta
    bookCard.innerHTML = `
      <div class="book-cover-wrapper">
        <img src="${coverSrc}" alt="${book.title}" class="book-cover">
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <p class="book-genre">${book.genre || 'General'}</p>
        <div class="book-card-footer">
          <span class="status-indicator ${statusClass}">
            <span class="dot"></span> ${book.status}
          </span>
          <div class="book-card-actions">
            <button class="edit-btn" data-id="${book.id}">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="delete-btn" data-id="${book.id}">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Abrir detalle del libro al hacer clic en la tarjeta
    bookCard.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn') || e.target.closest('.edit-btn')) return;
      openDetail(book);
    });

    // Evento de eliminar (Abre el modal de confirmación)
    const deleteBtn = bookCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedBookId = book.id;
      openModal(deleteModal);
    });

    // Evento de editar (Abre el formulario con la info actual)
    const editBtn = bookCard.querySelector('.edit-btn');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(book);
    });

    booksGrid.appendChild(bookCard);
  });
}

// ================= NAVEGACIÓN Y FILTROS =================
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderBooks();
  });
});

// ================= GESTIÓN DE MODALES =================
function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Llenar y abrir el modal de detalle
function openDetail(book) {
  document.getElementById('detailImg').src = book.cover || 'https://via.placeholder.com/150x220/e0e0e0/666666?text=Sin+Portada';
  document.getElementById('detailTitle').textContent = book.title;
  document.getElementById('detailAuthor').textContent = book.author;
  document.getElementById('detailGenre').textContent = book.genre || 'General';
  
  const badge = document.getElementById('detailStatusBadge');
  badge.textContent = book.status;
  badge.className = 'status-badge'; 
  if (book.status === 'Pendiente') badge.classList.add('badge-pendiente');
  else if (book.status === 'Terminado') badge.classList.add('badge-terminado');
  else badge.classList.add('badge-leyendo');

  document.getElementById('detailDescription').innerHTML = book.description || 
    `<p class="placeholder-text"><em>No hay descripción para este libro.</em></p>`;

  openModal(detailModal);
}

// Abrir formulario para editar
function openEditModal(book) {
  document.getElementById('formModalTitle').textContent = "Editar Libro";
  document.getElementById('submitFormBtn').textContent = "Guardar Cambios";
  
  document.getElementById('formBookId').value = book.id;
  document.getElementById('formTitle').value = book.title;
  document.getElementById('formAuthor').value = book.author;
  document.getElementById('formGenre').value = book.genre || '';
  document.getElementById('formStatus').value = book.status;
  document.getElementById('formCover').value = book.cover || '';
  document.getElementById('formDesc').value = book.description || '';

  openModal(addBookModal);
}

// ================= ENVÍO DEL FORMULARIO (POST O PUT A TU API) =================
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookId = document.getElementById('formBookId').value;
  
  const bookData = {
    title: document.getElementById('formTitle').value,
    author: document.getElementById('formAuthor').value,
    genre: document.getElementById('formGenre').value || 'General',
    status: document.getElementById('formStatus').value,
    cover: document.getElementById('formCover').value,
    description: document.getElementById('formDesc').value
  };

  try {
    if (bookId) {
      // Modo Edición: Petición PUT a la API
      const response = await fetch(`${API_URL}/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!response.ok) throw new Error('Error al actualizar el libro');
    } else {
      // Modo Adición: Petición POST a la API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!response.ok) throw new Error('Error al crear el libro');
    }

    // Volver a pedir la lista de libros actualizada a la base de datos
    await fetchBooks();
    addBookForm.reset();
    closeModal(addBookModal);
  } catch (error) {
    console.error('❌ Error en el formulario:', error);
    alert('Ocurrió un error al intentar guardar los datos en MySQL.');
  }
});

// ================= CONFIGURACIÓN DE LISTENERS =================

// Limpiar valores para un nuevo libro
openAddModalBtn.addEventListener('click', () => {
  document.getElementById('formModalTitle').textContent = "Añadir Nuevo Libro";
  document.getElementById('submitFormBtn').textContent = "Guardar en biblioteca";
  document.getElementById('formBookId').value = ""; 
  
  addBookForm.reset(); 
  openModal(addBookModal);
});

// Confirmar eliminación de libro en base de datos (Petición DELETE)
confirmDeleteBtn.addEventListener('click', async () => {
  if (!selectedBookId) return;

  try {
    const response = await fetch(`${API_URL}/${selectedBookId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar');

    await fetchBooks(); // Sincroniza desde MySQL
    closeModal(deleteModal);
  } catch (error) {
    console.error('❌ Error al eliminar libro:', error);
    alert('No se pudo borrar el libro de la base de datos.');
  }
});

// Cerrar modales mediante botones de cierre internos
closeAddModalBtn.addEventListener('click', () => closeModal(addBookModal));
closeDetailBtn.addEventListener('click', () => closeModal(detailModal));
cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));

// Cerrar modales si se hace clic fuera
window.addEventListener('click', (e) => {
  if (e.target === detailModal) closeModal(detailModal);
  if (e.target === deleteModal) closeModal(deleteModal);
  if (e.target === addBookModal) closeModal(addBookModal);
});

// ================= INICIALIZACIÓN =================
// Cargamos los datos desde el backend en vez de usar el array estático
fetchBooks();