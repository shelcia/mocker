import React from 'react';

import { CustomModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateProjectProps {
  formik: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const CreateProject = ({ setOpen, formik, open }: CreateProjectProps) => {
  const hasError = Boolean(formik.touched.name && formik.errors.name);

  return (
    <CustomModal open={open} setOpen={setOpen} title="New Project">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project name</Label>

          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Demo Project"
            value={formik.values.name || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={hasError}
            className={hasError ? 'border-destructive focus-visible:ring-destructive' : ''}
          />

          {hasError && <p className="text-sm text-destructive">{String(formik.errors.name)}</p>}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateProject;
