import { writable } from "svelte/store";
import { fetchNotes, createNote, updateNote, deleteNote } from "$lib/api/notesApi";
import type { Note, NewNote } from "$lib/types";

export const notes = writable<Note[]>([]);
export const loading = writable<boolean>(false);
export const error = writable<string | null>(null);

export const loadNotes = async () => {
    loading.set(true);
    error.set(null);
    try {
        const fetchedNotes: Note[] = await fetchNotes();
        notes.set(fetchedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    catch (err: unknown) {
       if (err instanceof Error){
        error.set(err.message);
       }
       else {
        error.set('Failed to load notes');
       }
    }
    finally {
        loading.set(false);
    }
};

export const addNote = async (noteData: NewNote) => {
    loading.set(true);
    error.set(null);
    try {
        const newNote: Note = await createNote(noteData);
        notes.update((currentNotes: Note[]) => [newNote, ...currentNotes]);
    }
    catch (err: unknown) {
       if (err instanceof Error){
        error.set(err.message);
       }
       else {
        error.set('Failed to create note');
       }
    }
    finally {
        loading.set(false);
    }
};

export const editNote = async (id: string, updatedData: Partial<NewNote>) => {
    loading.set(true);
    error.set(null);
    try {
        const updatedNote: Note = await updateNote(id, updatedData);
        notes.update((currentNotes: Note[]) => 
            currentNotes.map((note: Note) => (note.id === id ? updatedNote: note))
        );
    }
    catch (err: unknown) {
       if (err instanceof Error){
        error.set(err.message);
       }
       else {
        error.set(`Failed to edit note with id = ${id}`);
       }
    }
    finally {
        loading.set(false);
    }
};

export const removeNote = async (id: string) => {
    loading.set(true);
    error.set(null);
    try {
        await deleteNote(id);
        notes.update((currentNotes: Note[]) => currentNotes.filter((note: Note) => note.id !== id));
    }
    catch (err: unknown) {
       if (err instanceof Error){
        error.set(err.message);
       }
       else {
        error.set(`Failed to delete note with id = ${id}`);
       }
    }
    finally {
        loading.set(false);
    }
};