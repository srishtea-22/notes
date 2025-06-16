<script lang="ts">
    import { addNote, editNote } from '$lib/stores/notesStore';
    import { createEventDispatcher } from 'svelte';
    import type { Note, NewNote } from '$lib/types';

    export let note: Note | null = null;
    export let isEditing: boolean = !!note;

    let title: string = note ? note.title: '';
    let content: string = note ? note.content: '';

    const dispatch = createEventDispatcher<{formSubmitted: void; cancel: void}>();

    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            alert("Title and contenct  can't be empty");
            return;
        }

        const noteData: NewNote = {title, content};

        if (isEditing && note) {
            await editNote(note.id, noteData);
        }
        else {
            await addNote(noteData);
        }
        if (!isEditing) {
            title = '';
            content = '';
        }
        dispatch('formSubmitted');
    }

    function handleCancel() {
        dispatch('cancel');
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md mb-8">
    <div class="mb-4">
        <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Title:</label>
        <input
            type="text"
            id="title"
            bind:value={title}
            placeholder="Note title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-150 ease-in-out"
            required
        />
    </div>
    <div class="mb-6">
        <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Content:</label>
        <textarea
            id="content"
            bind:value={content}
            placeholder="Note content..."
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 h-24 resize-y transition duration-150 ease-in-out"
            required
        ></textarea>
    </div>
    <div class="flex items-center justify-end space-x-3">
        <button
            type="button"
            on:click={handleCancel}
            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
            Cancel
        </button>
        <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
            {isEditing ? 'Save Changes' : 'Add Note'}
        </button>
    </div>
</form>