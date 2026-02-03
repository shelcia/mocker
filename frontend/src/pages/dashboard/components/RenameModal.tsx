import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

import CustomModal from '../../../components/CustomModal';
import { apiProvider } from '../../../services/utilities/provider';

export type Project = {
  _id: string;
  name: string;
};

type RenameModalProps = {
  fetchProjects: () => void;
  projectToBeRename: Project | null;
  renameModalOpen: boolean;
  setRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RenameModal = ({
  fetchProjects,
  projectToBeRename,
  renameModalOpen,
  setRenameModalOpen,
}: RenameModalProps) => {
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

  const renameProject = (values: { name: string }, id: string) => {
    setRenameModalOpen(false);

    toast.promise(
      new Promise<any>((resolve, reject) => {
        apiProvider.putById('project/single', id, { name: values.name }).then((res: any) => {
          if (res.status === '200') {
            fetchProjects();
            resolve(res);
            return;
          }
          reject();
        });
      }),
      {
        loading: 'Renaming...',
        success: (res) => res.message,
        error: 'Rename failed',
      },
    );
  };

  const formik = useFormik<{ name: string }>({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: (values) => {
      if (!projectToBeRename?._id) return;
      renameProject(values, projectToBeRename._id);
    },
  });

  useEffect(() => {
    if (!projectToBeRename) return;
    formik.setValues({ name: projectToBeRename.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <Button type="submit">Rename</Button>

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
