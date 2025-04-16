export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    publishedDate: string;
    genre: string;
    isPublic: boolean;
    pages: number;
    language: string;
  }
  
  export type Genre = 
    | "Fiction" 
    | "Non-Fiction" 
    | "Science Fiction" 
    | "Fantasy" 
    | "Mystery" 
    | "Romance" 
    | "Thriller" 
    | "Horror" 
    | "Biography" 
    | "History";
  
  export interface FilterState {
    search: string;
    genre: Genre | "all";
    language: string;
    sortBy: "title" | "date";
    publicOnly: boolean;
  }