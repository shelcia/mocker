import React, { type ReactNode } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface CustomModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  width?: number;
  children?: ReactNode;
}

const CustomModal = ({ open, setOpen, title = '', width = 400, children }: CustomModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('max-h-[80vh] overflow-y-auto p-4 sm:p-6', 'sm:w-auto')}
        style={{
          minWidth: width,
        }}
      >
        {/* Header */}
        {title && (
          <DialogHeader className="flex flex-row items-center justify-between gap-4 w-full">
            <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
          </DialogHeader>
        )}

        {/* Body */}
        <div className="mt-2 w-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
