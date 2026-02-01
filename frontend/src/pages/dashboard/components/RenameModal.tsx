import React, { useEffect, useMemo } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
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
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              label="Project rename"
              type="text"
              name="name"
              sx={{ mb: 3 }}
              size="small"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name || ''}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <Stack direction="row" spacing={3}>
              <Button variant="contained" size="small" type="submit">
                Rename
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => setRenameModalOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </CustomModal>
      )}
    </>
  );
};
