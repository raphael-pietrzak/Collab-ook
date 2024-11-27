// store/useBooksStore.tsx
import { create } from 'zustand';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../api';

interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  progress: number;
  // Ajoutez d'autres propriétés de livre si nécessaire
}

interface BooksStore {
  books: Book[];
  fetchBooks: (token: string) => Promise<void>;
  fetchBookById: (id: string, token: string) => Promise<Book | undefined>;
  addBook: (data: any, token: string) => Promise<void>;
  updateBook: (id: string, data: any, token: string) => Promise<void>;
  removeBook: (id: string, token: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useBooksStore = create<BooksStore>((set) => ({
  books: [],
  isLoading: false,
  error: null,

  fetchBooks: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBooks(token);
      set({ books: response.data, isLoading: false });
      console.log(response.data);
    } catch (error) {
      set({ error: 'Failed to fetch books', isLoading: false });
    }
  },
  fetchBookById: async (id: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBookById(id, token);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch book', isLoading: false });
      return undefined;
    }
  },
  addBook: async (data: any, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await createBook(data, token);
      const response = await getBooks(token);
      set({ books: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add book', isLoading: false });
    }
  },
  updateBook: async (id: string, data: any, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await updateBook(id, data, token);
      const response = await getBooks(token);
      set({ books: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to edit book', isLoading: false });
    }
  },
  removeBook: async (id: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteBook(id, token);
      const response = await getBooks(token);
      set({ books: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to remove book', isLoading: false });
    }
  },
}));

