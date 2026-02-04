import React, { useState } from 'react';

import { apiResource } from '@/services/models/resourceModal';

import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import type { InputsState, SchemaItem } from './CommonResourceModal';
import CommonResourceModal from './CommonResourceModal';

type RouteParams = {
  userId?: string;
  projectId?: string;
};

interface ResourceModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchResource: (signal?: AbortSignal) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResourceModal = ({
  open,
  setOpen,
  fetchResource,
  loading,
  setLoading,
}: ResourceModalProps) => {
  const { userId, projectId } = useParams<RouteParams>();

  const [inputs, setInputs] = useState<InputsState>({
    name: '',
    number: 1,
    userId,
    projectId,
  });

  const [schema, setSchema] = useState<SchemaItem[]>([]);

  const createProject = async () => {
    if (!userId || !projectId) {
      toast.error('Invalid route parameters');

      return;
    }

    setLoading(true);
    toast('Adding');

    const body = {
      name: inputs.name,
      number: Number(inputs.number),
      userId,
      projectId,
      schema,
    };

    try {
      const res: any = await apiResource.post(body);

      if (res?.status === '200') {
        toast.success('Added Successfully');
        fetchResource();
        setSchema([]);
        setInputs({
          name: '',
          number: 1,
          userId,
          projectId,
        });
        setOpen(false);
      } else {
        toast.error('Error');
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonResourceModal
      open={open}
      setOpen={setOpen}
      title="New Resource"
      inputs={inputs}
      setInputs={setInputs}
      schema={schema}
      setSchema={setSchema}
      func={createProject}
    >
      {loading && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-y-0 left-0 w-1/3 animate-progress rounded-full bg-primary" />
          </div>

          <p className="text-sm font-medium text-primary">Generating data…</p>
        </div>
      )}
    </CommonResourceModal>
  );
};

export default ResourceModal;
