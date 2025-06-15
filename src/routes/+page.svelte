<script lang="ts">
    import { onMount } from 'svelte';
    import { notes, loadNotes, loading, error, removeNote } from '$lib/stores/notesStore';
    import NoteCard from '$lib/components/NoteCard.svelte';
    import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
    import type { Note } from '$lib/types';

    let showConfirmationModal: boolean = false;
    let noteToDeleteId: string | null = null;
    let noteToDeleteTitle: string = '';

    onMount(() => {
        loadNotes();
    });

    function confirmDelete(event: CustomEvent<string>) {
        const id: string = event.detail;
        const note: Note | undefined = $notes.find((n: Note) => n.id === id);
        if (note) {
            noteToDeleteId = id;
            noteToDeleteTitle = note.title;
            showConfirmationModal = true;
        }
    }

    async function handleConfirmDelete() {
        if (noteToDeleteId) {
            await removeNote(noteToDeleteId);
        }
        showConfirmationModal = false;
        noteToDeleteId = null;
        noteToDeleteTitle = '';
    }

    function handleCancelDelete() {
        showConfirmationModal = false;
        noteToDeleteId = null;
        noteToDeleteTitle = '';
    }
</script>

<div class="flex h-screen">
  <aside class="w-20 p-4 bg-blue-50 flex flex-col items-center">
    <div class="mb-6 mt-6">
      <img src="/logo.png" alt="logo" class="w-7 h-6">
    </div>
    <div class="mt-6 relative group">
      <div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#000000"><path d="M440-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
      </div>
      <div class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none font-unbounded">
        Add a note
      </div>
    </div>
    </aside>

  <div class="flex-1 flex flex-col overflow-y-auto">
    <div class="flex items-center p-4 backdrop-blur sticky top-0 bg-white/30 z-10">
      <h1 class="text-4xl font-unbounded font-extrabold text-black mt-4 ml-4">Notes</h1>
    </div>
    <div class="container px-20 py-6 w-full">
      {#if $loading}
      <p class="text-center text-blue-600 text-lg my-8">Loading notes...</p>
      {:else if $error}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8"
        role="alert"
      >
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{$error}</span>
        <p class="text-sm mt-2">Error fetching notes!</p>
      </div>
      {:else if $notes.length === 0}
      <p class="text-center text-gray-600 text-xl my-8">
        No notes found. Start by creating one!
      </p>
      {:else}
    <div class="columns-1 md:columns-3 gap-6 space-y-6">
      {#each $notes as note (note.id)}
        <div class="break-inside-avoid">
          <NoteCard {note} on:deleteNote="{confirmDelete}" />
        </div>
      {/each}
    </div>

      {/if}

      {#if showConfirmationModal}
      <ConfirmationModal
        message="Are you sure you want to delete"
        item="{noteToDeleteTitle}"
        on:confirm="{handleConfirmDelete}"
        on:cancel="{handleCancelDelete}"
      />
      {/if}
    </div>
  </div>
</div>