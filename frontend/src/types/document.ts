export interface User {
  userId: string;
  username: string;
}

export interface ConnectedUser extends User {
  cursor_position: number;
  cursor_line: number;
  cursor_column: number;
}

export interface DocumentState {
  content: string;
  version: number;
  lastUpdated: Date;
}

export interface TextOperation {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  text?: string;
  length?: number;
}

export interface DocumentUpdate {
  content: string;
  lastUpdated: Date;
  operation?: TextOperation;
  version: number;
  userId: string;
}

export interface CursorPosition {
  position: number;
  line: number;
  column: number;
}
