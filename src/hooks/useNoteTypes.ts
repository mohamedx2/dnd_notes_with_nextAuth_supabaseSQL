import { useCallback, useState } from 'react';
import { notification } from 'antd';
import { NoteType } from '../types';
import { createNoteType, deleteType, fetchNoteTypes } from '../actions/notes.action';

export const useNoteTypes = () => {
  const [noteTypes, setNoteTypes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTypes = useCallback(async () => {
    try {
      const types = await fetchNoteTypes();
      setNoteTypes(types);
      setLoading(false);
    } catch (error) {
      notification.error({ message: "Failed to fetch note types." });
      setLoading(false);
    }
  }, []);

  const addNoteType = useCallback(async (typeName: string) => {
    try {
      await createNoteType(typeName);
      await fetchAllTypes();
      notification.success({ message: "Note type created successfully" });
    } catch (error) {
      notification.error({ message: "Failed to create note type" });
    }
  }, [fetchAllTypes]);

  const removeNoteType = useCallback(async (id: number) => {
    try {
      await deleteType(id);
      await fetchAllTypes();
      notification.success({ message: "Note type deleted successfully" });
    } catch (error) {
      notification.error({ message: "Failed to delete note type" });
    }
  }, [fetchAllTypes]);

  return {
    noteTypes,
    loading,
    fetchAllTypes,
    addNoteType,
    removeNoteType,
  };
};
