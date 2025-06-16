<script lang="ts">
    import { onMount } from 'svelte';
    import { notes, loadNotes, loading, error, removeNote } from '$lib/stores/notesStore';
    import NoteCard from '$lib/components/NoteCard.svelte';
    import NoteForm from '$lib/components/NoteForm.svelte';
    import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
    import FormModalWrapper from '$lib/components/FormModalWrapper.svelte';
    import type { Note } from '$lib/types';
    import {writable, derived} from 'svelte/store';

    let showAddModal: boolean = false;
    let showEditModal: boolean = false;
    let currentNoteToEdit: Note | null = null;

    let showConfirmationModal: boolean = false;
    let noteToDeleteId: string | null = null;
    let noteToDeleteTitle: string = '';

    let searchQuery = writable('');
    const filteredNotes = derived(
      [notes, searchQuery],
      ([$notes, $searchQuery]) =>
        $notes.filter(note =>
          note.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes($searchQuery.toLowerCase())
        )
    );

    onMount(() => {
        loadNotes();
    });

    function openAddModal() {
      showAddModal = true;
    }
    function closeAddModal() {
      showAddModal = false;
    }

    function openEditModal(event: CustomEvent<Note>) {
      currentNoteToEdit = event.detail;
      showEditModal = true;
    }
    function closeEditModal() {
      showEditModal = false;
      currentNoteToEdit = null;
    }

    function handleNoteFormAction() {
      if (showAddModal) {
        closeAddModal();
      }
      else if (showEditModal) {
        closeEditModal();
      }
    }

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
      showConfirmationModal = false;
        if (noteToDeleteId) {
            await removeNote(noteToDeleteId);
        }  
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
  <div class="flex-1 flex flex-col overflow-y-auto">
    <div class="flex items-center p-4 backdrop-blur sticky top-0 bg-white/30 z-20"> <div class="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-10 items-center">
        <div class="flex flex-col md:flex-row items-center gap-2 md:gap-10 mt-4 ml-4 md:ml-16 w-full">
          <div class="flex items-center gap-2">
            <h1 class="text-3xl md:text-4xl font-unbounded font-extrabold text-black">Notes</h1>

            <div class="relative group md:hidden ml-4">
              <button on:click={openAddModal} aria-label="Add new note">
                <div class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                  <svg class="text-gray-500 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div class="relative flex items-center font-poppins w-full md:w-[30em] mt-4 md:mt-0">
            <input
              type="text"
              bind:value={$searchQuery}
              placeholder="Search"
              class="pl-10 pr-3 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-3 mt-4 mr-4 md:mr-16">
          <div class="relative group">
            <button on:click={openAddModal} aria-label="Add new note">
              <div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
                <svg class="text-gray-500 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
            </button>
            <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none font-unbounded">
              Add note
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container px-5 py-2 md:px-20 md:py-8 w-full">
      {#if $loading}
      <p class="text-center text-blue-600 text-lg my-8 font-poppins">Loading notes...</p>
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
      <p class="text-center text-gray-600 text-xl my-8 font-poppins">
        No notes found. Start by creating one!
      </p>
      {:else}
      <div class="columns-1 md:columns-3 gap-6 space-y-6">
        {#each $filteredNotes as note (note.id)}
        <div class="break-inside-avoid">
          <NoteCard {note} searchQuery={$searchQuery} on:deleteNote="{confirmDelete}" on:editNote="{openEditModal}" />
        </div>
        {/each}
      </div>
      {/if}

      <FormModalWrapper isOpen={showAddModal} title="Add New Note" on:close={handleNoteFormAction}>
        <NoteForm on:formSubmitted={handleNoteFormAction} on:cancel={handleNoteFormAction} />
      </FormModalWrapper>

      <FormModalWrapper isOpen={showEditModal} title="Edit Note" on:close={handleNoteFormAction}>
        {#if currentNoteToEdit}
          <NoteForm note={currentNoteToEdit} on:formSubmitted={handleNoteFormAction} on:cancel={handleNoteFormAction} />
        {/if}
      </FormModalWrapper>

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