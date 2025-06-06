// store/useBooksStore.tsx
import { create } from 'zustand';
import { getChapters, getChapterById, createChapter, updateChapter, deleteChapter } from '../api';

interface Chapter {
  id: string;
  title: string;
  content: string;
  bookId: string;
  // Add other chapter properties if needed
}

interface ChapterStore {
  chapters: Chapter[];
  fetchChapters: (data: any, token: string) => Promise<void>;
  fetchChapterById: (id: string, token: string) => Promise<Chapter | undefined>;
  addChapter: (id:string, data: any, token: string) => Promise<void>;
  updateChapter: (id: string, data: any, token: string) => Promise<void>;
  removeChapter: (id: string, data: any, token: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChaptersStore = create<ChapterStore>((set) => ({
  chapters: [],
  isLoading: false,
  error: null,

  fetchChapters: async (data: any, token: string) => {
    console.log("fetchChapters : ", data, token);
    set({ isLoading: true, error: null });
    try {
      const response = await getChapters(data.bookId, token);
      set({ chapters: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch chapters', isLoading: false });
    }
  },

  fetchChapterById: async (id: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getChapterById(id, token);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch chapter', isLoading: false });
      return undefined;
    }
  },

  addChapter: async (bookId:string, data: any, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await createChapter(bookId, data, token);
      const response = await getChapters(bookId, token);
      set({ chapters: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add chapter', isLoading: false });
    }
  },

  updateChapter: async (id: string, data: any, token: string) => {
    console.log("update chapters : ",data);
    set({ isLoading: true, error: null });
    try {
      await updateChapter(id, data, token);
      const response = await getChapters(data.bookId, token);
      set({ chapters: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to edit chapter', isLoading: false });
    }
  },

  removeChapter: async (id: string, data:any, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteChapter(id, token);
      const response = await getChapters(data.bookId, token);
      set({ chapters: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to remove chapter', isLoading: false });
    }
  },

}));

