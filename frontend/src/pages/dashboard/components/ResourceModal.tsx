import React, { useState } from 'react';

import { CustomLoadingModalBlock } from '@/components/common';
import { apiResource } from '@/services/models/resourceModal';
import type { Resource, RouteParams, SchemaItem } from '@/types';

import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import CommonResourceModal from './CommonResourceModal';

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

  const [inputs, setInputs] = useState<Resource>({
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
      {loading && <CustomLoadingModalBlock text="Creating resource..." />}
    </CommonResourceModal>
  );
};

export default ResourceModal;
