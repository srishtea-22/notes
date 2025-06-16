import type { Note, NewNote } from "$lib/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP error, status: ${response.status}, message: ${error}`);
    }
    return response.json() as Promise<T>;
};

export const fetchNotes = async (): Promise<Note[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes`);
        return await handleResponse<Note[]>(response);
    }
    catch (error){
        console.error("Error fetching notes: ", error);
        throw error;
    }
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...noteData,
                createdAt: new Date().toISOString()
            }),
        });
        return await handleResponse<Note>(response);
    }
    catch (error) {
        console.error("Error creating note: ", error);
        throw error;
    }
};

export const updateNote = async (id: string, noteData: Partial<NewNote>): Promise<Note> => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noteData),
        });
        return await handleResponse<Note>(response);
    }
    catch (error) {
        console.error("Error while updating note: ", error);
        throw error;
    }
};

export const deleteNote = async (id: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP error, status: ${response.status}, message: ${error}`);
        }
        return true;
    }
    catch (error) {
        console.error(`Error deleting note: `, error);
        throw error;
    }
};