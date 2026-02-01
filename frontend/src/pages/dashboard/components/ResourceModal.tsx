import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { apiResource } from '../../../services/models/resourceModal';
import CommonResourceModal, { InputsState, SchemaItem } from './CommonResourceModal';

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
        <Stack direction="column" spacing={3} mt={4}>
          <LinearProgress sx={{ mb: -2 }} />
          <Typography component="p" color="primary" align="center">
            Generating Data...
          </Typography>
        </Stack>
      )}
    </CommonResourceModal>
  );
};

export default ResourceModal;
