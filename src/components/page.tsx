/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from 'react';
import { Spinner, useDisclosure } from '@nextui-org/react';
import NoteForm from './noteForm';
import NoteList from './noteList';
import NoteTypeForm from './noteTypeForm';
import { useNotes } from '../hooks/useNotes';
import { useNoteTypes } from '../hooks/useNoteTypes';
import { NoteWithTypeName } from '../types';
import { ToastContainer } from 'react-toastify';
import { Button } from '@nextui-org/react';

const NotesPage: React.FC = () => {
  const { 
    notes, 
    loading: notesLoading, 
    fetchAllNotes,
    addNote,
    editNote,
    removeNote 
  } = useNotes();

  const {
    noteTypes,
    loading: typesLoading,
    fetchAllTypes,
    addNoteType,
    removeNoteType
  } = useNoteTypes();

  const [currentNote, setCurrentNote] = React.useState<NoteWithTypeName | null>(null);
  const { isOpen: isNoteModalOpen, onOpen: openNoteModal, onOpenChange: onOpenChangeNoteModal } = useDisclosure();
  const { isOpen: isTypeModalOpen, onOpen: openTypeModal, onOpenChange: onOpenChangeTypeModal } = useDisclosure();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  useEffect(() => {
    fetchAllNotes();
    fetchAllTypes();
  }, [fetchAllNotes, fetchAllTypes]);

  const handleNoteSubmit = async (noteData: any) => {
    if (isEditing && currentNote) {
      await editNote(currentNote.id, noteData);
    } else {
      await addNote(noteData);
    }
    onOpenChangeNoteModal();
    setCurrentNote(null);
    setIsEditing(false);
  };

  const handleTypeSubmit = async (typeName: string) => {
    await addNoteType(typeName);
    onOpenChangeTypeModal();
  };

  const handleEditNote: (note: NoteWithTypeName) => void = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
    openNoteModal();
  };

  const handleDeleteNote = async (id: number) => {
    await removeNote(id);
  };

  const handleDeleteType = async (id: number) => {
    await removeNoteType(id);
  };

  const handleMoveNote = async (noteId: number, newTypeId: number) => {
    await editNote(noteId, { typeId: newTypeId });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {(notesLoading || typesLoading) ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Notes
                </h1>
                <div className="flex gap-3">
                  <Button
                    onPress={openTypeModal}
                    className="bg-[#D95806] text-white font-medium"
                  >
                    Add Type
                  </Button>
                  <Button
                    onPress={() => {
                      setIsEditing(false);
                      openNoteModal();
                    }}
                    className="bg-[#D95806] text-white font-medium"
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              <NoteList
                notes={notes}
                noteTypes={noteTypes}
                onEdit={(note) => {
                  setCurrentNote(note);
                  setIsEditing(true);
                  openNoteModal();
                }}
                onDelete={removeNote}
                onRemoveType={removeNoteType}
                onAddType={openTypeModal}
              />

              <NoteForm
                isOpen={isNoteModalOpen}
                onOpenChange={onOpenChangeNoteModal}
                onSubmit={handleNoteSubmit}
                noteTypes={noteTypes}
                initialValues={currentNote}  // Change from currentNote to initialValues
                isEditing={isEditing}
              />
              <NoteTypeForm
                isOpen={isTypeModalOpen}
                onOpenChange={onOpenChangeTypeModal}
                onSubmit={addNoteType}
                noteTypes={noteTypes}
              />
            </>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default NotesPage;
