export interface Note {
  id: number;
  content: string;
  typeId: number;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export interface NoteType {
  id: number;
  typeName: string;
}

export interface NoteWithTypeName extends Note {
  typeName: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface NoteListProps {
  notes: NoteWithTypeName[];
  onEdit: (note: NoteWithTypeName) => void;
  onDelete: (id: number) => Promise<void>;
  onAddNote: () => void;
  onAddType: () => void;
  noteTypes: NoteType[];
  onRemoveType?: (id: number) => void;
  onMoveNote?: (noteId: number, typeId: number) => void;
  undo?: (note: NoteWithTypeName) => void;
}
