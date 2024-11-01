/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { notification } from 'antd';

import {
  Spinner,
  useDisclosure,
} from '@nextui-org/react';

import {
  createNote,
  createNoteType,
  deleteNote,
  deleteType,
  fetchNotes,
  fetchNoteTypes,
  NoteWithTypeName,
  updateNote,
} from '../actions/notes.action';
import NoteForm from './noteForm';
import NoteList from './noteList';
import NoteTypeForm from './noteTypeForm';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<NoteWithTypeName[]>([]);
  const [noteTypes, setNoteTypes] = useState<{ id: number; typeName: string }[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteWithTypeName | null>(null);
  const { isOpen: isNoteModalOpen, onOpen: openNoteModal, onOpenChange: onOpenChangeNoteModal } = useDisclosure();
  const { isOpen: isTypeModalOpen, onOpen: openTypeModal, onOpenChange: onOpenChangeTypeModal } = useDisclosure();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [notesRes, typesRes] = await Promise.all([fetchNotes(), fetchNoteTypes()]);
      setNotes(notesRes.filter((note) => !!note.content)); // Filter out notes with empty content
      setNoteTypes(typesRes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({ message: "Failed to fetch data." });
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNote = async (values: any) => {
    try {
      const createdNote = await createNote({
        content: values.content,
        typeId: values.typeId,
        color: values.color
      });
      if (createdNote) {
        notification.success({ message: "Note created successfully.", placement: 'bottomRight' });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating note:", error);
      notification.error({ message: "Failed to create note." });
    }
  };

  const handleUpdateNote = async (values: any) => {
    if (currentNote) {
      try {
        const updatedNote = await updateNote(currentNote.id, {
          content: values.content,
          typeId: values.typeId,
          color: values.color
        });
        if (updatedNote) {
          notification.success({ message: "Note updated successfully." });
          fetchData();
          setCurrentNote(null);
        }
      } catch (error) {
        console.error("Error updating note:", error);
        notification.error({ message: "Failed to update note." });
      }
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const success = await deleteNote(noteId);
      if (success) {
        notification.success({ message: "Note deleted successfully." });
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      notification.error({ message: "Failed to delete note." });
    }
  };

  const handleAddNoteType = async (type: string) => {
    const newType = { id: Date.now(), typeName: type }; // Using Date.now() for temporary ID
    setNoteTypes((prevTypes) => [...prevTypes, newType]);

    try {
      const success = await createNoteType(type);
      if (success) {
        notification.success({ message: "Note type added successfully." });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding note type:", error);
      notification.error({ message: "Failed to add note type." });
      setNoteTypes((prevTypes) => prevTypes.filter((t) => t.id !== newType.id));
    }
  };

  const handleRemoveType = async (typeId: number) => {
    const removedType = noteTypes.find((type) => type.id === typeId);
    setNoteTypes((prevTypes) => prevTypes.filter((type) => type.id !== typeId));

    try {
      const success = await deleteType(typeId);
      if (success) {
        notification.success({ message: "Note type removed successfully." });
        fetchData();
      }
    } catch (error) {
      console.error("Error removing note type:", error);
      notification.error({ message: "Failed to remove note type." });
      if (removedType) {
        setNoteTypes((prevTypes) => [...prevTypes, removedType]);
      }
    }
  };

  const handleMoveNote = async (noteId: number, newTypeId: number) => {
    try {
      const note = notes.find((note) => note.id === noteId);
      if (note) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, typeId: newTypeId } : note
          )
        );
        await updateNote(noteId, { typeId: newTypeId });
        notification.success({ message: "Note moved successfully." });
      }
    } catch (error) {
      console.error("Error moving note:", error);
      notification.error({ message: "Failed to move note." });
    }
  };

  const handleUndo = async (values: any) => {
    try {
      const createdNote = await createNote({
        content: values.content,
        typeId: values.typeId,
        color: values.color
      });
      if (createdNote) {
        notification.success({ message: "Note recovered successfully." });
        fetchData();
      }
    } catch (error) {
      console.error("Error recovering note:", error);
      notification.error({ message: "Failed to recover note." });
    }
  };

  const openModal = (note: NoteWithTypeName) => {
    setIsEditing(note.id !== 0);
    setCurrentNote(note);
    openNoteModal();
  };

  const handleFinish = (values: any) => {
    if (isEditing && currentNote?.content !== "") {
      handleUpdateNote(values);
    } else {
      handleCreateNote(values);
    }
  };

  return (
    <div className="p-4">
      <NoteForm
        isOpen={isNoteModalOpen}
        isEditing={isEditing}
        currentNote={currentNote}
        onFinish={handleFinish}
        noteTypes={noteTypes}
        onOpenChange={onOpenChangeNoteModal}
      />
      <NoteTypeForm
        onOpenChange={onOpenChangeTypeModal}
        isOpen={isTypeModalOpen}
        onFinish={handleAddNoteType}
      />
      <NoteList
        notes={notes}
        noteTypes={noteTypes}
        onEdit={openModal}
        onDelete={handleDeleteNote}
        onRemoveType={handleRemoveType}
        onAddType={openTypeModal}
        onMoveNote={handleMoveNote}
        undo={handleUndo}
      />
      {loading && (
        <div className="flex justify-center items-center">
          <Spinner color="warning" />
        </div>
      )}
    </div>
  );
};

export default NotesPage;
