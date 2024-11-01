"use client";

import 'react-toastify/dist/ReactToastify.css';

import React, { useState } from 'react';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
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

interface NoteListProps {
  notes: NoteWithTypeName[];
  noteTypes: { id: number; typeName: string }[];
  onEdit: (note: NoteWithTypeName) => void;
  onDelete: (noteId: number) => void;
  onRemoveType: (typeId: number) => void;
  onAddType: () => void;
  onMoveNote: (noteId: number, newTypeId: number) => void;
  undo: (note: NoteWithTypeName) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  noteTypes,
  onEdit,
  onDelete,
  onRemoveType,
  onAddType,
  onMoveNote,
  undo,
}) => {
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [deletedNote, setDeletedNote] = useState<NoteWithTypeName | null>(null);

  const getColumnNotes = (typeId: number) =>
    notes.filter((note) => note.typeId === typeId);

  

  const handleDelete = () => {
    if (noteToDelete !== null) {
      const note = notes.find((n) => n.id === noteToDelete);
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
    const { source, destination } = result;
    if (!destination) {
      const noteId = parseInt(result.draggableId, 10);
      setNoteToDelete(noteId);
      onOpen();
      return;
    }
    if (source.droppableId !== destination.droppableId) {
      const destinationTypeId = parseInt(destination.droppableId.replace("droppable-", ""), 10);
      const noteId = parseInt(result.draggableId, 10);
      onMoveNote(noteId, destinationTypeId);
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
                    onClick={() => onRemoveType(type.id)}
                  >
                    <DeleteOutlined /> Remove Type
                  </Button>
                </div>
              </div>
              <Droppable droppableId={`droppable-${type.id}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-[#F3F4F6] p-[10px] rounded-[9px] min-h-[300px] gap-[10px] ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}
                  >
                    {getColumnNotes(type.id).map((item, index) => (
                      <Draggable
                        key={item.id.toString()}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              style={{ background: item.color }}
                              className={`p-4 rounded-lg shadow-sm transition-transform mb-2 transform ${
                                snapshot.isDragging ? "translate-y-[-5px] shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2 rounded-[9px] py-[17px]">
                                <div className="flex items-center w-[185px]">
                                  <span
                                    className={`mr-2 text-[14px] font-[400] leading-[18.62px] text-left ${
                                      isColorDark(item.color) ? "text-white" : "text-black"
                                    }`}
                                    style={{ fontFamily: 'Segoe UI' }}
                                  >
                                    {item.content}
                                  </span>
                                </div>
                                <div className="flex space-x-1 w-[50px]">
                                  <Button
                                    onClick={() => onEdit(item)}
                                    variant="light"
                                    className="w-[24px] h-[24px] text-[#D95806] min-w-0 p-0"
                                    style={{ borderRadius: '50%', fontSize: '16px' }}
                                  >
                                    <EditOutlined style={{ fontSize: '16px' }} />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setNoteToDelete(item.id);
                                      onOpen();
                                    }}
                                    variant="light"
                                    className="w-[24px] h-[24px] text-[#D95806] min-w-0 p-0"
                                    style={{ borderRadius: '50%', fontSize: '16px' }}
                                  >
                                    <DeleteOutlined style={{ fontSize: '16px' }} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          <div className="col-span-1">
            <Button
              onClick={onAddType}
              className="w-[255px] md:w-[525px] h-[40px] rounded-[7px] p-[10px] bg-[#D95806] text-white text-[14px] font-[400] leading-[18.62px] text-left"
              style={{ fontFamily: 'Segoe UI' }}
            >
              <PlusOutlined /> Add Type
            </Button>
          </div>
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