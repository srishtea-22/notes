<script lang="ts">
    import { addNote, editNote } from '$lib/stores/notesStore';
    import { createEventDispatcher } from 'svelte';
    import type { Note, NewNote } from '$lib/types';

    export let note: Note | null = null;
    export let isEditing: boolean = !!note;

     const colorOptions = ['#fec971', '#fe9b72', '#b693fd', '#e3ef8f', '#bfdbfe'];

    let color: string = note?.color || colorOptions[0];
    let title: string = note ? note.title: '';
    let content: string = note ? note.content: '';

    const dispatch = createEventDispatcher<{formSubmitted: void; cancel: void}>();

    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            alert("Title and content can't be empty");
            return;
        }

        const noteData: NewNote = {title, content, color};

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
    function selectColor(selectedColor: string) {
    color = selectedColor;
}
</script>

<form on:submit|preventDefault={handleSubmit} class="p-6 rounded-lg font-poppins">
    <div class="mb-4">
        <label for="title" class="block text-gray-700 font-bold mb-2">Title:</label>
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
        <label for="content" class="block text-gray-700 font-bold mb-2">Content:</label>
        <textarea
            id="content"
            bind:value={content}
            placeholder="Note content..."
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 h-24 resize-y transition duration-150 ease-in-out"
            required
        ></textarea>
    </div>
    <div class="mb-6">
        <label for="color" class="block text-gray-700 font-bold mb-2">Color:</label>
        <div class="flex space-x-2">
            {#each colorOptions as optionColor (optionColor)}
                <button
                    type="button"
                    class="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 flex items-center justify-center transition duration-150 ease-in-out"
                    style="background-color: {optionColor};"
                    on:click={() => selectColor(optionColor)}
                >
                    {#if color === optionColor}
                        <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
    <div class="flex items-center justify-end space-x-3">
        <button
            type="button"
            on:click={handleCancel}
            class="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out cursor-pointer"
        >
            Cancel
        </button>
        <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out cursor-pointer"
        >
            {isEditing ? 'Save Changes' : 'Add Note'}
        </button>
    </div>
</form>