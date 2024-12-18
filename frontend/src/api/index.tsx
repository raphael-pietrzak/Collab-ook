import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
});

const getAuthHeaders = (token: string | null) => ({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});

// books
export const getBooks = (token: string | null) => api.get('books', getAuthHeaders(token));
export const getBookById = (id: string, token: string | null) => api.get(`books/${id}`, getAuthHeaders(token));
export const createBook = (data: any, token: string | null) => api.post('books', data, getAuthHeaders(token));
export const updateBook = (id: string, data: any, token: string | null) => api.put(`books/${id}`, data, getAuthHeaders(token));
export const deleteBook = (id: string, token: string | null) => api.delete(`books/${id}`, getAuthHeaders(token));

// chapters
export const getChapters = (bookId: string, token: string | null) => 
    api.get(`books/${bookId}/chapters`, getAuthHeaders(token));
export const getChapterById = (id: string, token: string | null) => api.get(`chapters/${id}`, getAuthHeaders(token));
export const createChapter = (id: string, data: any, token: string | null) => api.post(`books/${id}/chapters`, data, getAuthHeaders(token));
export const updateChapter = (id: string, data: any, token: string | null) => api.put(`chapters/${id}`, data, getAuthHeaders(token));
export const deleteChapter = (id: string, token: string | null) => api.delete(`chapters/${id}`, getAuthHeaders(token));

// users
export const getUsers = (token: string | null) => api.get('users', getAuthHeaders(token));
export const getUserById = (id: string, token: string | null) => api.get(`users/${id}`, getAuthHeaders(token));
export const createUser = (data: any, token: string | null) => api.post('users', data, getAuthHeaders(token));
export const updateUser = (id: string, data: any, token: string | null) => api.put(`users/${id}`, data, getAuthHeaders(token));
export const deleteUser = (id: string, token: string | null) => api.delete(`users/${id}`, getAuthHeaders(token));

// auth
export const login = (data: any) => api.post('auth/login', data);
export const register = (data: any) => api.post('auth/register', data);


