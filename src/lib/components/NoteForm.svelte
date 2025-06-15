<script lang="ts">
    import { addNote, editNote } from '$lib/stores/notesStore';
    import { createEventDispatcher } from 'svelte';
    import type { Note, NewNote } from '$lib/types';

    export let note: Note | null = null;
    export let isEditing: boolean = false;

    let title: string = note ? note.title: '';
    let content: string = note ? note.content: '';

    const dispatch = createEventDispatcher<{noteUpdated: void; cancelEdit: void}>();

    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            alert("Title and contenct  can't be empty");
            return;
        }

        const noteData: NewNote = {title, content};

        if (isEditing && note) {
            await editNote(note.id, noteData);
            dispatch('noteUpdated');
        }
        else {
            await addNote(noteData);
            title = '';
            content = '';
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
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
    <div class="flex items-center justify-between">
        <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
            {isEditing ? 'Save Changes' : 'Add Note'}
        </button>
        {#if isEditing}
            <button
                type="button"
                on:click={() => dispatch('cancelEdit')}
                class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
                Cancel
            </button>
        {/if}
    </div>
</form>