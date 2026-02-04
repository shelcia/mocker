import { useEffect, useState } from 'react';

import { CustomAvatarDisplayname, CustomTooltip } from '@/components/common';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { BACKEND_URL } from '@/services/api';
import { apiProject } from '@/services/models/projectModel';
import { apiResource } from '@/services/models/resourceModal';
import { apiUser } from '@/services/models/userModal';
import type { ApiStringResponse } from '@/types';
import { copyTextToClipboard } from '@/utils';

import { ChevronLeft, Copy, ExternalLink, Eye, Pencil, Plus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import CloneModal from './components/CloneModal';
import DeleteResourceModal from './components/DeleteResourceModal';
import EditResourceModal from './components/EditResourceModal';
import EndpointModal from './components/EndpointModal';
import ResourceModal from './components/ResourceModal';
import ResultModal from './components/ResultModal';

type RouteParams = {
  projectId?: string;
};

type ResourceModel = {
  _id: string;
  name: string;
};

type ApiResponse<T> = {
  status: string;
  message: T;
};

type ResultRow = Record<string, unknown>;

const Collection = () => {
  const endpoint = `${BACKEND_URL}/user/:endpoint`;

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [projectName, setProjectName] = useState<string>('');
  const [resources, setResources] = useState<ResourceModel[]>([]);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const { projectId } = useParams<RouteParams>();

  const fetchResource = (signal?: AbortSignal) => {
    if (!projectId) return;

    apiResource.getSingle(`project/${projectId}`, signal).then((res: any) => {
      if (res.status === '200') {
        setResources(Array.isArray(res.message) ? (res.message as ResourceModel[]) : []);
      }
    });

    apiProject.getSingle(`single/${projectId}`, signal).then((res: any) => {
      if (res.status === '200') {
        setProjectName(String(res.message?.name ?? ''));
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchResource(ac.signal);

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delResource = (id: string) => {
    if (!id) return;

    toast('Deleting ...');
    apiResource.remove(id).then((res: ApiStringResponse) => {
      if (res.status === '200') {
        fetchResource();
      } else {
        toast.error('Error');
      }
    });
  };

  const handleChecked = (e: string | boolean, id: string) => {
    setCheckedList((prev) => (e ? [...prev, id] : prev.filter((_id) => _id !== id)));
  };

  const delSelected = () => {
    const body = { resources: checkedList };

    toast.promise(
      new Promise<string>((resolve, reject) => {
        apiResource.removeAll(body).then((res: any) => {
          if (res.status === '200') {
            fetchResource();
            setCheckedList([]);
            resolve(String(res.message));

            return;
          }

          reject(String(res.message));
        });
      }),
      {
        loading: 'Deleting',
        success: (message) => message,
        error: (err) => String(err),
      },
    );
  };

  const handleCopyClick = async (data: string) => {
    try {
      await copyTextToClipboard(data);
      setIsCopied(true);
      toast.success('Copied !');
      setTimeout(() => setIsCopied(false), 5000);
    } catch (err) {
      toast.error("Couldn't copy !");
    }
  };

  return (
    <>
      <div className="space-y-1">
        {/* Back */}
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="border-0 shadow-none pt-0">
          <CardContent className="p-4 md:p-6">
            {/* Title + CTA row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-medium tracking-tight">{projectName}</h1>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => setOpen(true)} variant="outline">
                  <Plus className="size-4" /> New Resource
                </Button>

                {checkedList.length !== 0 && (
                  <Button variant="destructive" onClick={delSelected}>
                    Delete selected
                    <Badge variant="secondary" className="ml-2">
                      {checkedList.length}
                    </Badge>
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Endpoint alert */}
            <Alert className="border-border/60">
              <AlertTitle className="font-semibold">API endpoint</AlertTitle>

              <AlertDescription className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <code className="w-fit rounded-md bg-muted px-2 py-1 font-mono text-sm">
                  {endpoint}
                </code>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isCopied}
                  onClick={() => handleCopyClick(endpoint)}
                >
                  {isCopied ? 'Done' : 'Copy'}
                </Button>
              </AlertDescription>
            </Alert>

            {/* Docs link */}
            <div className="mt-4">
              <a
                href="https://documenter.getpostman.com/view/21272376/2s8YmUMLP2#f02f8b5d-1988-4177-816a-6da7fcb47d88"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Test Postman Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Resource list */}
            <div className="mt-6 space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-start gap-2 w-full rounded-xl border bg-background/60 p-3 backdrop-blur-sm"
                >
                  <div className="pt-3">
                    <Checkbox
                      checked={checkedList.includes(resource._id)}
                      onCheckedChange={(v) => handleChecked(v, resource._id)}
                      aria-label={`Select ${resource.name}`}
                    />
                  </div>

                  <Resource
                    resource={resource}
                    fetchResource={fetchResource}
                    delResource={delResource}
                  />
                </div>
              ))}

              {resources.length === 0 && (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No resources yet. Create your first one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ResourceModal
        open={open}
        setOpen={setOpen}
        fetchResource={fetchResource}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default Collection;

// --------------------------
// Resource Row Component
// --------------------------

type ResourceProps = {
  resource: ResourceModel;
  fetchResource: (signal?: AbortSignal) => void;
  delResource: (id: string) => void;
};

const Resource = ({ resource, fetchResource, delResource }: ResourceProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [endModal, setEndModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [cloneModal, setCloneModal] = useState<boolean>(false);
  const [delResourceModal, setDelResourceModal] = useState<boolean>(false);

  const [result, setResult] = useState<ResultRow[]>([]);

  const fetchResult = (signal?: AbortSignal) => {
    setLoading(true);

    apiUser.getSingle(resource._id, signal).then((res: ApiResponse<ResultRow[]>) => {
      if (res.status === '200') {
        setResult(Array.isArray(res.message) ? res.message : []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchResult(ac.signal);

    return () => ac.abort();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: Avatar + name */}
        <CustomAvatarDisplayname text={resource.name} open={false} />

        {/* Right: actions */}
        <div className="flex flex-wrap gap-2 md:justify-end">
          <CustomTooltip
            onClickFn={() => setOpenModal(true)}
            text="View generated JSON data"
            variant="outline"
          >
            <Eye />
          </CustomTooltip>
          <CustomTooltip
            onClickFn={() => setEditModal(true)}
            text="Edit Resource"
            variant="secondary"
          >
            <Pencil />
          </CustomTooltip>
          <CustomTooltip onClickFn={() => setCloneModal(true)} text="Clone Resource">
            <Copy />
          </CustomTooltip>
          <CustomTooltip
            onClickFn={() => setDelResourceModal(true)}
            text="Delete Resource"
            variant="destructive"
          >
            <Trash />
          </CustomTooltip>

          <CustomTooltip
            onClickFn={() => setEndModal(true)}
            text="View Endpoints"
            variant="secondary"
            icon={false}
          >
            View Endpoints
          </CustomTooltip>
        </div>
      </div>

      <ResultModal open={openModal} setOpen={setOpenModal} result={result} loading={loading} />

      <EndpointModal open={endModal} setOpen={setEndModal} result={resource._id} />

      <EditResourceModal
        open={editModal}
        setOpen={setEditModal}
        result={resource._id}
        fetchResult={fetchResult}
      />

      <CloneModal
        open={cloneModal}
        setOpen={setCloneModal}
        result={resource._id}
        fetchResources={fetchResource}
      />

      <DeleteResourceModal
        open={delResourceModal}
        setOpen={setDelResourceModal}
        result={resource._id}
        delResource={delResource}
      />
    </>
  );
};
