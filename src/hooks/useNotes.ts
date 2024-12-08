import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { Note, NoteType, NoteWithTypeName, NoteInput } from '../types';
import { createNote, deleteNote, fetchNotes, updateNote } from '../actions/notes.action';

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteWithTypeName[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllNotes = useCallback(async () => {
    try {
      const notesData = await fetchNotes();
      setNotes(notesData.filter((note) => !!note.content));
      setLoading(false);
    } catch (error) {
      notification.error({ message: "Failed to fetch notes." });
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (noteData: NoteInput) => {
    try {
      await createNote(noteData);
      await fetchAllNotes();
      notification.success({ message: "Note created successfully" });
    } catch (error) {
      notification.error({ message: "Failed to create note" });
    }
  }, [fetchAllNotes]);

  const editNote = useCallback(async (id: number, noteData: Partial<Note>) => {
    try {
      await updateNote(id, noteData);
      await fetchAllNotes();
      notification.success({ message: "Note updated successfully" });
    } catch (error) {
      notification.error({ message: "Failed to update note" });
    }
  }, [fetchAllNotes]);

  const removeNote = useCallback(async (id: number) => {
    try {
      await deleteNote(id);
      await fetchAllNotes();
      notification.success({ message: "Note deleted successfully" });
    } catch (error) {
      notification.error({ message: "Failed to delete note" });
    }
  }, [fetchAllNotes]);

  return {
    notes,
    loading,
    fetchAllNotes,
    addNote,
    editNote,
    removeNote,
  };
};
