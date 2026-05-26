document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const addNoteFab = document.getElementById('add-note-fab');
    const noteForm = document.getElementById('note-form');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const backToListBtn = document.getElementById('back-to-list-btn');

    const listView = document.getElementById('list-view');
    const detailView = document.getElementById('detail-view');

    let notes = []; // Array to store note objects
    let currentNoteId = null; // To track which note is being edited (null for new note)

    // --- Helper Functions ---
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveNotes() {
        localStorage.setItem('mobileNotes', JSON.stringify(notes));
    }

    function loadNotes() {
        const storedNotes = localStorage.getItem('mobileNotes');
        notes = storedNotes ? JSON.parse(storedNotes) : [];
        renderNotes();
    }

    function showView(viewToShow) {
        if (viewToShow === 'list') {
            listView.classList.add('active-view');
            listView.classList.remove('hidden-view');
            detailView.classList.add('hidden-view');
            detailView.classList.remove('active-view');
            addNoteFab.style.display = 'flex'; // Show FAB
        } else if (viewToShow === 'detail') {
            detailView.classList.add('active-view');
            detailView.classList.remove('hidden-view');
            listView.classList.add('hidden-view');
            listView.classList.remove('active-view');
            addNoteFab.style.display = 'none'; // Hide FAB
        }
    }

    function clearForm() {
        noteTitleInput.value = '';
        noteContentInput.value = '';
        currentNoteId = null; // Reset current note ID
    }

    // --- Rendering Notes ---
    function renderNotes() {
        notesList.innerHTML = ''; // Clear existing notes
        if (notes.length === 0) {
            notesList.innerHTML = '<li class="notes-list-item empty-state">No notes yet. Tap "+" to add one!</li>';
            return;
        }

        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.classList.add('notes-list-item');
            listItem.dataset.id = note.id;
            listItem.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
            `;
            listItem.addEventListener('click', () => editNote(note.id));
            notesList.appendChild(listItem);
        });
    }

    // --- Event Handlers ---
    addNoteFab.addEventListener('click', () => {
        clearForm(); // Clear form for new note
        showView('detail');
    });

    noteForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!title) {
            alert('Note title cannot be empty.');
            return;
        }

        if (currentNoteId) {
            // Editing existing note
            const noteIndex = notes.findIndex(note => note.id === currentNoteId);
            if (noteIndex !== -1) {
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
            }
        } else {
            // Adding new note
            const newNote = {
                id: generateUniqueId(),
                title: title,
                content: content,
                createdAt: new Date().toISOString()
            };
            notes.unshift(newNote); // Add to the beginning
        }

        saveNotes();
        renderNotes();
        clearForm();
        showView('list');
    });

    backToListBtn.addEventListener('click', () => {
        clearForm();
        showView('list');
    });

    function editNote(id) {
        const noteToEdit = notes.find(note => note.id === id);
        if (noteToEdit) {
            noteTitleInput.value = noteToEdit.title;
            noteContentInput.value = noteToEdit.content;
            currentNoteId = id; // Set the current note ID for editing
            showView('detail');
        }
    }

    // --- Initialization ---
    loadNotes();
    showView('list'); // Ensure list view is shown on load
});
