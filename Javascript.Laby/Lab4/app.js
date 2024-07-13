document.addEventListener('DOMContentLoaded', () => {
  // Referencje do formularza
  const form = document.getElementById('note-form');
  const notesContainer = document.getElementById('notes-container');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const colorInput = document.getElementById('color');
  const pinInput = document.getElementById('pin');
  const tagsInput = document.getElementById('tags');
  const searchInput = document.getElementById('search');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNote();
  });


  searchInput.addEventListener('input', renderNotes);

  // Nowa notka
  function addNote() {
    const title = titleInput.value;
    const content = contentInput.value;
    const color = colorInput.value;
    const pin = pinInput.checked;
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Obiekt notatki
    const note = {
      id: Date.now(),
      title,
      content,
      color,
      pin,
      tags,
      createdAt: new Date().toISOString()
    };
    //localstorage
    const notes = getNotesFromStorage();
    notes.push(note);
    saveNotesToStorage(notes);
    renderNotes();
    form.reset();
  }


  function getNotesFromStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
  }


  function saveNotesToStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function renderNotes() {
    notesContainer.innerHTML = '';
    const notes = getNotesFromStorage();
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredNotes = notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    // Sortowanie notatek przypięte, daty utworzenia
    filteredNotes.sort((a, b) => b.pin - a.pin || new Date(b.createdAt) - new Date(a.createdAt));

    // Tworzenie elementów dla każdej notatki
    filteredNotes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.style.backgroundColor = note.color;
      noteElement.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.content}</p>
        <div class="note-tags">${note.tags.map(tag => `#${tag}`).join(' ')}</div>
        <div class="note-footer">
          <small>${new Date(note.createdAt).toLocaleString()}</small>
          <div>
            <button class="edit" data-id="${note.id}">Edytuj</button>
            <button class="delete" data-id="${note.id}">Usuń</button>
          </div>
        </div>
      `;
      notesContainer.appendChild(noteElement);
    });

    // Usun
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', () => {
        deleteNote(button.dataset.id);
      });
    });

    // Edycja
    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', () => {
        editNote(button.dataset.id);
      });
    });
  }

  // Funkcja usuwająca notatkę
  function deleteNote(id) {
    const notes = getNotesFromStorage().filter(note => note.id != id);
    saveNotesToStorage(notes); 
    renderNotes();
  }

  // Funkcja edytująca notatkę
  function editNote(id) {
    const notes = getNotesFromStorage();
    const note = notes.find(note => note.id == id);

    if (note) {
      titleInput.value = note.title;
      contentInput.value = note.content;
      colorInput.value = note.color;
      pinInput.checked = note.pin;
      tagsInput.value = note.tags.join(', ');

      deleteNote(id);
    }
  }

  renderNotes();
});
