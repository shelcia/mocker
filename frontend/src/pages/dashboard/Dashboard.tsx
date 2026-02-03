import React, { useEffect, useMemo, useState } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import ConfirmDeleteModal from './components/ConfirmDelProjectModal';

import { apiProject } from '../../services/models/projectModel';
import { RenameModal } from './components/RenameModal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import CreateProject from './components/CreateProject';
import { Pencil, Plus, Trash } from 'lucide-react';

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

  const handleChecked = (checked: boolean | string, id: string) => {
    setCheckedList((prev) => (checked ? [...prev, id] : prev.filter((_id) => _id !== id)));
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
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">Projects</h1>

          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setOpen(true)}
            aria-label="Create project"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Body */}
        {loading ? (
          <ProjectsSkeleton />
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between rounded-xl border bg-card/50 px-3 py-2 transition hover:bg-card"
              >
                {/* Left side */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checkedList.includes(project._id)}
                    onCheckedChange={(v) => handleChecked(v, project._id)}
                    aria-label={`Select ${project.name}`}
                  />

                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/${userId}/${project._id}`)}
                    className="group flex items-center gap-3 text-left"
                  >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition group-hover:bg-blue-800">
                      {(project.name?.charAt(0) ?? '?').toUpperCase()}
                    </div>

                    <div className="leading-tight">
                      <div className="text-sm font-medium text-foreground group-hover:text-blue-800">
                        {project.name}
                      </div>
                      <div className="text-xs text-muted-foreground">Open project</div>
                    </div>
                  </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => {
                            setProjectToBeRename(project);
                            setRenameModalOpen(true);
                          }}
                          aria-label="Edit project"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Project</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => {
                            setToBeDeleted(project);
                            setConfirmDeleteModal(true);
                          }}
                          aria-label="Delete project"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Project</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}

            {/* Bulk delete */}
            {checkedList.length !== 0 && (
              <div className="pt-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmDeleteModal(true);
                    setIsMultipleDelete(true);
                  }}
                >
                  Delete selected ({checkedList.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {open && <CreateProject setOpen={setOpen} formik={formik} open={open} />}

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

function ProjectsSkeleton() {
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
}
