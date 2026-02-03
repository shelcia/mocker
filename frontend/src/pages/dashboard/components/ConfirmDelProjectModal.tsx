import React, { useEffect, useState } from 'react';
import CustomModal from '../../../components/CustomModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ConfirmDeleteModal = ({
  confirmDeleteModal,
  setConfirmDeleteModal,
  project,
  deleteProject,
  isMultipleDelete = false,
  setIsMultipleDelete,
  delSelected = () => {},
}) => {
  const [formData, setFormData] = useState('');
  const [disabled, setDisabled] = useState(true);

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
          <label className="text-sm font-medium text-foreground">Project name</label>
          <Input
            value={formData}
            onChange={(e) => {
              setFormData(e.target.value);
              checkProjectName();
            }}
            placeholder={isMultipleDelete ? 'Type DELETE' : `Type ${project.name}`}
          />
        </div>

        <div className="flex gap-3">
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
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmDeleteModal;
