export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type NewNote = Omit<Note, 'id' | 'createdAt'>;