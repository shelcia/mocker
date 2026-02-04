import React from 'react';

import { CustomModal } from '@/components/common';
import { Button } from '@/components/ui/button';

interface DeleteResourceModalProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  result?: string;
  delResource: (id: string) => void;
}

const DeleteResourceModal = ({ open, setOpen, result, delResource }: DeleteResourceModalProps) => (
  <CustomModal open={open} setOpen={setOpen} title="Delete Resource" width={600}>
    <div className="space-y-4">
      <p className="text-sm text-foreground">Are you sure you want to delete this resource?</p>

      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={() => {
            delResource(result);
            setOpen(false);
          }}
        >
          Yes, delete
        </Button>

        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  </CustomModal>
);

export default DeleteResourceModal;
