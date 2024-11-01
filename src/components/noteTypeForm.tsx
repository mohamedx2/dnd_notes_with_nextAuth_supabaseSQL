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

interface NoteTypeFormProps {
  isOpen: boolean;
  onFinish: (type: string) => void;
  onOpenChange: () => void;
}

const NoteTypeForm: React.FC<NoteTypeFormProps> = ({ isOpen, onFinish, onOpenChange }) => {
  const [type, setType] = React.useState('');

  const handleFinish = () => {
    if (type.trim()) {
      onFinish(type);
      setType(''); // Clear the input after finishing
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              New Type
            </ModalHeader>
            <ModalBody>
              <Input
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Enter type name" // Optional placeholder text
              />
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleFinish();
                  onClose();
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NoteTypeForm;
