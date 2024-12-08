"use client"
import React from 'react';

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
} from '@nextui-org/react';
import { NoteType } from '@/types';

interface NoteTypeFormProps {
  isOpen: boolean;
  onSubmit: (typeName: string) => Promise<void>;
  onOpenChange: () => void;
  onDeleteType?: (id: number) => Promise<void>;
  noteTypes?: NoteType[];
}

const NoteTypeForm: React.FC<NoteTypeFormProps> = ({ isOpen, onSubmit, onOpenChange }) => {
  const [type, setType] = React.useState('');

  const handleFinish = async () => {
    if (type.trim()) {
      await onSubmit(type);
      setType('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
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
                New Type
              </h3>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Type Name"
                placeholder="Enter type name"
                variant="bordered"
                value={type}
                onChange={(e) => setType(e.target.value)}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: "bg-default-100/50 dark:bg-default-100/20"
                }}
              />
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
                Add Type
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NoteTypeForm;
