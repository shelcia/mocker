import { useMemo, useState } from 'react';

import { CustomAvatarDisplayname, CustomTooltip } from '@/components/common';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { apiProject } from '@/services/models/projectModel';
import type { ApiResponse, Project } from '@/types';
import { queryKeys } from '@/utils';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Pencil, Plus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import ConfirmDeleteModal from './components/ConfirmDelProjectModal';
import CreateProject from './components/CreateProject';
import RenameModal from './components/RenameModal';

const Dashboard = () => {
  const { userId } = useParams<{ userId: string }>();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // selection + modals
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Project | null>(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [projectToBeRename, setProjectToBeRename] = useState<Project | null>(null);

  // -----------------------
  // Query: Projects
  // -----------------------
  const projectsQuery = useQuery({
    queryKey: userId ? queryKeys.projects(userId) : ['projects', 'missing-userId'],
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const res = (await apiProject.getSingle(userId!, signal)) as ApiResponse<Project[]>;

      if (res.status !== '200') throw new Error(String(res.message ?? 'Failed to load projects'));

      return Array.isArray(res.message) ? res.message : [];
    },
  });

  // -----------------------
  // Mutations
  // -----------------------
  const addProjectMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!userId) throw new Error('Missing userId');

      const res = (await apiProject.post({ name, userId })) as ApiResponse<string>;

      return res;
    },
    onSuccess: async (res) => {
      if (res.status === '200') {
        toast.success(String(res.message));
        setOpen(false);
        await qc.invalidateQueries({ queryKey: queryKeys.projects(userId!) });
      } else {
        toast.error(String(res.message));
      }
    },
    onError: () => toast.error('Error'),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = (await apiProject.remove(id)) as ApiResponse<string>;

      return res;
    },
    onSuccess: async (res) => {
      if (res.status === '200') {
        toast.success('Deleted');
        await qc.invalidateQueries({ queryKey: queryKeys.projects(userId!) });
      } else {
        toast.error(String(res.message));
      }
    },
    onError: () => toast.error('Delete failed'),
  });

  const deleteSelectedMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = (await apiProject.removeAll({ projects: ids })) as ApiResponse<string>;

      return res;
    },
    onSuccess: async (res) => {
      if (res.status === '200') {
        toast.success(String(res.message));
        setCheckedList([]);
        await qc.invalidateQueries({ queryKey: queryKeys.projects(userId!) });
      } else {
        toast.error(String(res.message));
      }
    },
    onError: () => toast.error('Delete failed'),
  });

  // -----------------------
  // Formik: Create
  // -----------------------
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().min(3).max(25).required('Project Name is required'),
      }),
    [],
  );

  const formik = useFormik<{ name: string }>({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, helpers) => {
      await addProjectMutation.mutateAsync(values.name);
      helpers.resetForm();
    },
  });

  // -----------------------
  // Handlers
  // -----------------------
  const handleChecked = (checked: boolean, id: string) => {
    setCheckedList((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const deleteProject = async (id?: string) => {
    if (!id) return;

    setConfirmDeleteModal(false);
    toast.promise(deleteProjectMutation.mutateAsync(id), {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Delete failed',
    });
  };

  const delSelected = async () => {
    setConfirmDeleteModal(false);
    toast.promise(deleteSelectedMutation.mutateAsync(checkedList), {
      loading: 'Deleting...',
      success: 'Deleted',
      error: 'Delete failed',
    });
  };

  const projects = projectsQuery.data ?? [];

  return (
    <>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-medium tracking-tight">Projects</h1>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setOpen(true)} variant="outline">
              <Plus className="size-4" />
              New Project
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Body */}
        {projectsQuery.isLoading ? (
          <ProjectsSkeleton />
        ) : projectsQuery.isError ? (
          <div className="rounded-xl border bg-card/50 p-4 text-sm text-muted-foreground">
            Failed to load projects.
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between rounded-xl border bg-card/50 px-4 py-3 transition hover:bg-card"
              >
                {/* Left side */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checkedList.includes(project._id)}
                    onCheckedChange={(v) => handleChecked(Boolean(v), project._id)}
                    aria-label={`Select ${project.name}`}
                  />

                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/${userId}/${project._id}`)}
                    className="group flex items-center gap-3 text-left"
                  >
                    {/* Avatar */}
                    <CustomAvatarDisplayname text={project.name} />
                  </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                  <CustomTooltip
                    onClickFn={() => {
                      setProjectToBeRename(project);
                      setRenameModalOpen(true);
                    }}
                    text="Edit project"
                    variant="secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </CustomTooltip>

                  <CustomTooltip
                    onClickFn={() => {
                      setToBeDeleted(project);
                      setIsMultipleDelete(false);
                      setConfirmDeleteModal(true);
                    }}
                    text="Delete project"
                    variant="destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </CustomTooltip>
                </div>
              </div>
            ))}

            {/* Bulk delete */}
            {checkedList.length !== 0 && (
              <div className="pt-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setToBeDeleted(null);
                    setIsMultipleDelete(true);
                    setConfirmDeleteModal(true);
                  }}
                >
                  Delete selected ({checkedList.length})
                </Button>
              </div>
            )}
          </div>
        )}
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No projects yet. Create your first one.
          </div>
        )}
      </CardContent>

      {/* Create */}
      {open && <CreateProject setOpen={setOpen} formik={formik} open={open} />}

      {/* Delete confirm */}
      <ConfirmDeleteModal
        confirmDeleteModal={confirmDeleteModal}
        setConfirmDeleteModal={setConfirmDeleteModal}
        project={toBeDeleted ?? ({} as Project)}
        deleteProject={(id: string) => void deleteProject(id)}
        isMultipleDelete={isMultipleDelete}
        setIsMultipleDelete={setIsMultipleDelete}
        delSelected={() => void delSelected()}
      />

      <RenameModal
        userId={userId!}
        projectToBeRename={projectToBeRename}
        renameModalOpen={renameModalOpen}
        setRenameModalOpen={setRenameModalOpen}
      />
    </>
  );
};

export default Dashboard;

const ProjectsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border bg-card/50 px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};
