"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import { NoteWithTypeName } from '@/actions/notes.action';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from '@nextui-org/react';

interface NoteFormProps {
  isOpen: boolean;
  isEditing: boolean;
  currentNote: NoteWithTypeName | null;
  onFinish: (values: { typeId: number | null; content: string; color: string }) => void;
  noteTypes: { id: number; typeName: string }[];
  onOpenChange: (isOpen: boolean) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  isOpen,
  isEditing,
  currentNote,
  onFinish,
  noteTypes,
  onOpenChange
}) => {
  const [typeId, setTypeId] = useState<string | null>(currentNote?.typeId.toString() || null);
  const [content, setContent] = useState<string>(currentNote?.content || '');
  const [color, setColor] = useState<string>(currentNote?.color || '#000000');

  useEffect(() => {
    if (currentNote) {
      setTypeId(currentNote.typeId.toString());
      setContent(currentNote.content);
      setColor(currentNote.color || '#000000');
    } else {
      setTypeId(null);
      setContent('');
      setColor('#000000');
    }
  }, [currentNote]);

  const handleFinish = () => {
    onFinish({
      typeId: typeId ? parseInt(typeId, 10) : null,
      content,
      color,
    });
    // Reset the form
    setTypeId(null);
    setContent('');
    setColor('#ffffff');
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => onOpenChange(isOpen)}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-lg font-medium">
                {isEditing ? 'Edit Note' : 'Create Note'}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4 p-4">
                <div>
                  <label htmlFor="typeId" className="block text-sm font-medium mb-2">Type</label>
                  <RadioGroup
                    value={typeId || ''}
                    onValueChange={setTypeId}
                    orientation="horizontal"
                    className="flex flex-wrap gap-2"
                  >
                    {noteTypes.map((type) => (
                      <Radio key={type.id} value={type.id.toString()} size="sm">
                        {type.typeName}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Enter the note content"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-2">Color</label>
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button onClick={() => {
                onClose();
                handleFinish();
              }}>
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NoteForm;
