<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Note } from '$lib/types';

    export let note: Note;
    export let searchQuery = '';
    const dispatch = createEventDispatcher<{ deleteNote: string; editNote: Note }>(); 

    function formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; 
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function handleDeleteClick() {
        dispatch('deleteNote', note.id); 
    }

    function handleEditClick() {
        dispatch('editNote', note);
    }

    function highlightMatch(text: string, query: string): string {
      if (!query.trim()) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }
</script>

<div class="bg-white rounded-3xl shadow-md p-6 flex flex-col justify-between h-fit max-w-full overflow-x-auto" style="background-color: {note.color}">
    <div>
        <h3 class="text-xl font-black mb-2 font-poppins">{@html highlightMatch(note.title, searchQuery)}</h3>
        <p class="mb-4 break-words font-poppins">{@html highlightMatch(note.content, searchQuery)}</p>
    </div>
    <div class="flex justify-between items-center text-sm mt-auto pt-4 font-poppins">
        <span>{formatDate(note.createdAt)}</span>
        <div class="flex space-x-2">
            <button
                on:click={handleEditClick}
                aria-label="Edit note"
                class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </button>
            <button
                on:click={handleDeleteClick}
                aria-label="delete note"
                class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-400 transition-colors duration-200 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
            </div>
        </div>
</div>