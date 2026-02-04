import React, { useEffect, useState } from 'react';

import { CustomModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project } from '@/types';

interface ConfirmDeleteModalProps {
  confirmDeleteModal: boolean;
  setConfirmDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;

  project: Project;

  deleteProject: (id: string) => void | Promise<void>;

  isMultipleDelete?: boolean;
  setIsMultipleDelete?: React.Dispatch<React.SetStateAction<boolean>>;

  delSelected?: () => void | Promise<void>;
}

const ConfirmDeleteModal = ({
  confirmDeleteModal,
  setConfirmDeleteModal,
  project,
  deleteProject,
  isMultipleDelete = false,
  setIsMultipleDelete,
  delSelected = () => {},
}: ConfirmDeleteModalProps) => {
  const [formData, setFormData] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const checkProjectName = () => {
    if (isMultipleDelete) {
      if ('DELETE' === formData) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }

      return;
    }

    if (project.name === formData) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  useEffect(() => {
    checkProjectName();
  }, [formData]);

  useEffect(() => {
    //Set multiple delete to false on closing
    confirmDeleteModal || setIsMultipleDelete(false);
  }, [confirmDeleteModal]);

  return (
    <CustomModal open={confirmDeleteModal} setOpen={setConfirmDeleteModal} title="Delete Project">
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          This action cannot be undone. This will permanently delete the{' '}
          <span className="italic">
            {isMultipleDelete ? 'selected' : <span className="font-semibold">{project.name}</span>}
          </span>{' '}
          project and its associated resources.
        </p>

        <p className="text-sm text-foreground">
          Please type{' '}
          <span className="italic font-semibold">{isMultipleDelete ? 'DELETE' : project.name}</span>{' '}
          to confirm.
        </p>

        <div className="space-y-2">
          <Input
            value={formData}
            onChange={(e) => {
              setFormData(e.target.value);
              checkProjectName();
            }}
            placeholder={isMultipleDelete ? 'Type DELETE' : `Type ${project.name}`}
          />
        </div>

        <div className="flex gap-2 justify-end items-center">
          <Button
            variant="secondary"
            onClick={() => {
              setFormData('');
              setDisabled(true);
              setConfirmDeleteModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={disabled}
            onClick={() => {
              isMultipleDelete ? delSelected() : deleteProject(project._id);
              setFormData('');
              setDisabled(true);
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmDeleteModal;
