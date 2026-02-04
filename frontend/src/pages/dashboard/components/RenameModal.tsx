import React, { useEffect, useMemo } from 'react';

import { CustomModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiProvider } from '@/services/utilities/provider';
import type { Project } from '@/types';
import { queryKeys } from '@/utils';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

interface RenameModalProps {
  userId: string;
  projectToBeRename: Project | null;
  renameModalOpen: boolean;
  setRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RenameModal = ({
  userId,
  projectToBeRename,
  renameModalOpen,
  setRenameModalOpen,
}: RenameModalProps) => {
  const qc = useQueryClient();

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string()
          .min(3, 'Project should be of minimum 3 characters length')
          .max(25)
          .required('Project Name is required'),
      }),
    [],
  );

  const renameMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      const res = await apiProvider.putById('project/single', payload.id, { name: payload.name });

      return res as { status: string; message: string };
    },
    onSuccess: async (res) => {
      if (res.status === '200') {
        await qc.invalidateQueries({ queryKey: queryKeys.projects(userId) });
      }
    },
    onError: () => toast.error('Rename failed'),
  });

  const formik = useFormik<{ name: string }>({
    initialValues: { name: '' },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      if (!projectToBeRename?._id) return;

      setRenameModalOpen(false);

      toast.promise(renameMutation.mutateAsync({ id: projectToBeRename._id, name: values.name }), {
        loading: 'Renaming...',
        success: 'Renamed',
        error: 'Rename failed',
      });

      helpers.resetForm();
    },
  });

  useEffect(() => {
    if (!projectToBeRename) return;

    formik.setValues({ name: projectToBeRename.name });
  }, [projectToBeRename]);

  return (
    <>
      {renameModalOpen && (
        <CustomModal open={renameModalOpen} setOpen={setRenameModalOpen} title="Rename project">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter project name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name || ''}
                className={formik.touched.name && formik.errors.name ? 'border-destructive' : ''}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={renameMutation.isPending}>
                Rename
              </Button>

              <Button type="button" variant="secondary" onClick={() => setRenameModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CustomModal>
      )}
    </>
  );
};

export default RenameModal;
