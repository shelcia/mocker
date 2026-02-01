import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import CustomModal from '../../components/CustomModal';
import ConfirmDeleteModal from './components/ConfirmDelProjectModal';
import { PartLoader } from '../../components/CustomLoading';
import CustomCheckbox from '../../components/CustomCheckbox';
import { CustomTooltip } from '../../components/CustomTooltip';

import { apiProject } from '../../services/models/projectModel';
import { RenameModal } from './components/RenameModal';

type RouteParams = {
  userId?: string;
};

export type Project = {
  _id: string;
  name: string;
};

type ApiResult<T = unknown> = {
  status: string;
  message: T;
};

const Dashboard = () => {
  const { userId } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [toBeDeleted, setToBeDeleted] = useState<Project | null>(null);

  const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const [projectToBeRename, setProjectToBeRename] = useState<Project | null>(null);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isMultipleDelete, setIsMultipleDelete] = useState<boolean>(false);

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

  const formik = useFormik<{ name: string }>({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: (values, helpers) => {
      addProject(values.name, helpers);
    },
  });

  const addProject = async (name: string, helpers: { resetForm: () => void }) => {
    if (!userId) {
      toast.error('Missing userId in route');
      return;
    }

    const body = { name, userId };

    const res = (await apiProject.post(body)) as ApiResult<string>;
    if (res.status === '200') {
      toast.success(res.message);
      setOpen(false);
      helpers.resetForm();
      fetchProjects();
    } else {
      toast.error(res.message);
    }
  };

  const fetchProjects = () => {
    if (!userId) {
      toast.error('Missing userId in route');
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    const signal = ac.signal;

    apiProject.getSingle(userId, signal).then((res: any) => {
      if (res.status === '200') {
        setLoading(false);
        setProjects(Array.isArray(res.message) ? (res.message as Project[]) : []);
      } else {
        toast.error('Error !');
        setLoading(false);
      }
    });

    return () => ac.abort();
  };

  useEffect(() => {
    const cleanup = fetchProjects();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delProject = (id: string) => {
    toast('Deleting !');
    apiProject.remove(id).then((res: any) => {
      if (res.status === '200') {
        fetchProjects();
      }
    });
    setConfirmDeleteModal(false);
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setCheckedList((prev) => (e.target.checked ? [...prev, id] : prev.filter((_id) => _id !== id)));
  };

  const delSelected = () => {
    const body = { projects: checkedList };

    toast.promise(
      new Promise<string>((resolve, reject) => {
        apiProject.removeAll(body).then((res: any) => {
          if (res.status === '200') {
            fetchProjects();
            setCheckedList([]);
            resolve(String(res.message));
            return;
          }
          reject(String(res.message));
        });
        setConfirmDeleteModal(false);
      }),
      {
        loading: 'Deleting',
        success: (message) => message,
        error: (err) => String(err),
      },
    );
  };

  return (
    <>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Typography variant="h5" component="h1" color="primary">
            Projects
          </Typography>

          <Button
            color="primary"
            variant="contained"
            size="small"
            sx={{ borderRadius: '50ex', py: 0.2, px: 1.2, minWidth: 0 }}
            onClick={() => setOpen(true)}
          >
            <FaPlus size="0.8rem" />
          </Button>
        </Stack>

        {loading ? (
          <PartLoader />
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem sx={{ justifyContent: 'space-between' }} key={project._id}>
                <Stack direction="row">
                  <CustomCheckbox handleChecked={handleChecked} id={project._id} />

                  <Box
                    sx={{ display: 'flex', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/${userId}/${project._id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: blue[500], ':hover': { bgcolor: blue[800] } }}>
                        {project.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>

                    <Typography
                      sx={{ display: 'inline', mt: 1, ':hover': { color: blue[800] } }}
                      component="h1"
                      variant="h6"
                      color="text.primary"
                    >
                      {project.name}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <CustomTooltip title="Edit Project" arrow>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setProjectToBeRename(project);
                        setRenameModalOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </Button>
                  </CustomTooltip>

                  <CustomTooltip title="Delete Project" arrow>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => {
                        setToBeDeleted(project);
                        setConfirmDeleteModal(true);
                      }}
                    >
                      <FiTrash color="#fff" />
                    </Button>
                  </CustomTooltip>
                </Stack>
              </ListItem>
            ))}

            {checkedList.length !== 0 && (
              <Button
                sx={{ mt: 2 }}
                onClick={() => {
                  setConfirmDeleteModal(true);
                  setIsMultipleDelete(true);
                }}
                variant="contained"
                color="error"
              >
                Delete selected
              </Button>
            )}
          </List>
        )}
      </CardContent>

      {open && (
        <CustomModal open={open} setOpen={setOpen} title="New Project">
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              label="Project name"
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
                Create
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </CustomModal>
      )}

      <ConfirmDeleteModal
        confirmDeleteModal={confirmDeleteModal}
        setConfirmDeleteModal={setConfirmDeleteModal}
        project={toBeDeleted ?? ({} as Project)}
        deleteProject={delProject}
        isMultipleDelete={isMultipleDelete}
        setIsMultipleDelete={setIsMultipleDelete}
        delSelected={delSelected}
      />

      <RenameModal
        fetchProjects={fetchProjects}
        setRenameModalOpen={setRenameModalOpen}
        projectToBeRename={projectToBeRename}
        renameModalOpen={renameModalOpen}
      />
    </>
  );
};

export default Dashboard;
