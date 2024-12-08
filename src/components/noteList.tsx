"use client";

import 'react-toastify/dist/ReactToastify.css';

import React, { useState } from 'react';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  toast,
  ToastContainer,
} from 'react-toastify';

import { NoteWithTypeName } from '@/actions/notes.action';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import {
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { Card, CardBody } from "@nextui-org/react";

interface NoteListProps {
  notes: NoteWithTypeName[];
  noteTypes: { id: number; typeName: string }[];
  onEdit: (note: NoteWithTypeName) => void;
  onDelete: (noteId: number) => void;
  onRemoveType?: (typeId: number) => void;
  onAddType?: () => void;
  onMoveNote?: (noteId: number, newTypeId: number) => void;
  undo?: (note: NoteWithTypeName) => void;
  onAddNote?: () => void;
}

const NoteList = ({
  notes,
  noteTypes,
  onEdit,
  onDelete,
  onRemoveType = () => {},
  onAddType,
  onMoveNote = () => {},
  undo = () => {},
  onAddNote = () => {},
}: NoteListProps) => {
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [deletedNote, setDeletedNote] = useState<NoteWithTypeName | null>(null);
  const [localNotes, setLocalNotes] = useState(notes);

  const getColumnNotes = (typeId: number) =>
    localNotes.filter((note) => note.typeId === typeId && note.id);

  const handleDelete = () => {
    if (noteToDelete !== null) {
      const note = localNotes.find((n) => n.id === noteToDelete);
      if (note) {
        setDeletedNote(note);
        onDelete(noteToDelete);
        toast.success(({ closeToast }) => (
          <div className="flex items-center justify-between">
            <p>
              Note deleted. <b onClick={handleUndo}>Undo</b>.
            </p>
            <Button
              onClick={() => {
                closeToast();
                handleUndo();
              }}
              color="primary"
            >
              Dismiss
            </Button>
          </div>
        ), {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleUndo = () => {
    if (deletedNote) {
      undo(deletedNote);
      setDeletedNote(null);
      toast.success('Note recovered', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Find the note being dragged
    const draggedNote = localNotes.find(note => note.id.toString() === draggableId);
    if (!draggedNote) {
      console.warn(`Note with id ${draggableId} not found`);
      return;
    }

    if (!destination) {
      setNoteToDelete(draggedNote.id);
      onOpen();
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const newTypeId = parseInt(destination.droppableId.replace("droppable-", ""));
      if (!isNaN(newTypeId)) {
        // Optimistically update the UI
        const updatedNotes = localNotes.map(note => 
          note.id === draggedNote.id 
            ? { ...note, typeId: newTypeId }
            : note
        );
        setLocalNotes(updatedNotes);
        
        // Then update the backend
        onMoveNote(draggedNote.id, newTypeId);
      }
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isColorDark = (color: string): boolean => {
    if (!color) {
      return false;
    }
    let r: number, g: number, b: number;

    if (color.startsWith("#")) {
      const bigint = parseInt(color.slice(1), 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else {
      const rgbMatch = color.match(/\d+/g);
      if (!rgbMatch) {
        throw new Error("Invalid color format");
      }
      [r, g, b] = rgbMatch.map(Number);
    }

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 150;
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center gap-[20px] my-[71px]">
          {noteTypes.map((type) => (
            <div key={type.id} className="flex flex-col gap-[20px] w-[255px] md:w-[525px] ">
              <div className="flex flex-wrap justify-between gap-[20px] w-[255px] md:w-[525px] ">
                <div className="text-center text-sm w-[255px] md:w-auto">
                  <h3 className="text-xl text-gray-800">{type.typeName}</h3>
                </div>
                <div className="flex px-[14px] justify-between w-[255px]">
                  <Button
                    className="h-[27px] w-[121px] rounded-[5px] p-[10px] bg-[#D95806] text-white text-[11.5px] font-[400] leading-[20px] text-left"
                    style={{ fontFamily: 'Calibri' }}
                    variant="light"
                    onClick={() =>
                      onEdit({
                        id: 0,
                        content: '',
                        typeId: type.id,
                        color: '#000',
                        typeName: type.typeName,
                      })
                    }
                  >
                    <PlusOutlined /> Add Note
                  </Button>
                  <Button
                    className="h-[27px] w-[97px] rounded-[5px] p-[10px] text-[#D95806] text-[11.5px] font-[400] leading-[20px] text-left border border-[#D95806]"
                    style={{ fontFamily: 'Calibri' }}
                    variant="light"
                    onClick={() => onRemoveType?.(type.id)}
                  >
                    <DeleteOutlined /> Remove Type
                  </Button>
                </div>
              </div>
              <Droppable droppableId={`droppable-${type.id}`}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[300px] ${
                      snapshot.isDraggingOver 
                        ? "bg-primary-50 border-2 border-primary" 
                        : "bg-default-50"
                    }`}
                    radius="lg"
                    shadow="sm"
                  >
                    <div className="space-y-3">
                      {getColumnNotes(type.id).map((note, index) => (
                        <Draggable
                          key={note.id}
                          draggableId={note.id.toString()}
                          index={index}
                          shouldRespectForcePress
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                transform: snapshot.isDragging
                                  ? provided.draggableProps.style?.transform
                                  : "none",
                              }}
                              className={`${
                                snapshot.isDragging
                                  ? "shadow-lg scale-105"
                                  : "hover:scale-102"
                              } transition-all duration-200`}
                              radius="md"
                            >
                              <CardBody
                                style={{ background: note.color }}
                                className={`p-3 flex flex-row justify-between items-center ${
                                  isColorDark(note.color) ? "text-white" : "text-black"
                                }`}
                              >
                                <span className="text-sm font-normal flex-grow">
                                  {note.content}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => onEdit(note)}
                                    className={`min-w-0 ${
                                      isColorDark(note.color)
                                        ? "text-white/90 hover:text-white"
                                        : "text-black/90 hover:text-black"
                                    }`}
                                  >
                                    <EditOutlined />
                                  </Button>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => {
                                      setNoteToDelete(note.id);
                                      onOpen();
                                    }}
                                    className={`min-w-0 ${
                                      isColorDark(note.color)
                                        ? "text-white/90 hover:text-white"
                                        : "text-black/90 hover:text-black"
                                    }`}
                                  >
                                    <DeleteOutlined />
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </Card>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <Modal isOpen={isOpen} onClose={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Note</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this note?</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    handleDelete();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default NoteList;