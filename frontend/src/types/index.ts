export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Book {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
  book_id: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}