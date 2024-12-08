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
  initialValues: NoteWithTypeName | null;
  onSubmit: (values: { typeId: number | null; content: string; color: string }) => void;
  noteTypes: { id: number; typeName: string }[];
  onOpenChange: (isOpen: boolean) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  isOpen,
  isEditing,
  initialValues,
  onSubmit,
  noteTypes,
  onOpenChange
}) => {
  const [typeId, setTypeId] = useState<string | null>(initialValues?.typeId.toString() || null);
  const [content, setContent] = useState<string>(initialValues?.content || '');
  const [color, setColor] = useState<string>(initialValues?.color || '#D95806');

  useEffect(() => {
    if (initialValues) {
      setTypeId(initialValues.typeId.toString());
      setContent(initialValues.content);
      setColor(initialValues.color || '#D95806');
    } else {
      setTypeId(null);
      setContent('');
      setColor('#D95806');
    }
  }, [initialValues]);

  const handleFinish = () => {
    if (content.trim() && typeId) {
      onSubmit({
        typeId: parseInt(typeId),
        content: content.trim(),
        color
      });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-200 dark:border-gray-700"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Note' : 'New Note'}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <RadioGroup
                  label="Select Type"
                  value={typeId || undefined}
                  onValueChange={setTypeId}
                  orientation="horizontal"
                  classNames={{
                    label: "text-gray-700 dark:text-gray-300 font-medium"
                  }}
                >
                  {noteTypes.map((type) => (
                    <Radio key={type.id} value={type.id.toString()}>
                      {type.typeName}
                    </Radio>
                  ))}
                </RadioGroup>

                <Textarea
                  label="Content"
                  placeholder="Enter note content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="bordered"
                  classNames={{
                    label: "text-gray-700 dark:text-gray-300 font-medium",
                    input: "bg-transparent",
                    inputWrapper: "bg-default-100/50 dark:bg-default-100/20"
                  }}
                />

                <Input
                  type="color"
                  label="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  variant="bordered"
                  classNames={{
                    label: "text-gray-700 dark:text-gray-300 font-medium",
                    input: "bg-transparent h-10",
                    inputWrapper: "bg-default-100/50 dark:bg-default-100/20 h-10"
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button 
                color="primary"
                onPress={() => {
                  handleFinish();
                  onClose();
                }}
                className="bg-[#D95806] font-medium"
              >
                {isEditing ? 'Save Changes' : 'Add Note'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NoteForm;
