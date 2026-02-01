import React, { useEffect, useState } from 'react';
import { Stack, LinearProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { apiResource } from '../../../services/models/resourceModal';
import CommonResourceModal from './CommonResourceModal';

type RouteParams = {
  userId?: string;
  projectId?: string;
};

export type SchemaOption = Record<string, unknown>;

export type SchemaItem = {
  id: number;
  label: string;
  field: string;
  option?: SchemaOption;
};

type InputsState = {
  name: string;
  number: number;
  userId?: string;
  projectId?: string;
  id?: string;
};

type CloneModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** resource id to clone */
  result: string;
  fetchResources: () => void;
};

const CloneModal = ({ open, setOpen, result, fetchResources }: CloneModalProps) => {
  const { userId, projectId } = useParams<RouteParams>();
  const [loading, setLoading] = useState<boolean>(false);

  const [inputs, setInputs] = useState<InputsState>({
    name: '',
    number: 1,
    userId,
    projectId,
  });

  const [schema, setSchema] = useState<SchemaItem[]>([]);

  const fetchResource = (signal: AbortSignal) => {
    apiResource.getSingle(result, signal).then((res: any) => {
      if (res?.status === '200') {
        setInputs({
          name: res?.message?.name ?? '',
          number: Number(res?.message?.number ?? 1),
          userId,
          projectId,
          id: res?.message?._id,
        });

        setSchema((res?.message?.schema ?? []) as SchemaItem[]);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
  }, []);

  const cloneResource = async () => {
    setLoading(true);

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
        toast.success('Cloned Successfully');
        setOpen(false);
        fetchResources();
      } else {
        setOpen(false);
        toast.error('Error');
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
      title="Clone Resource"
      inputs={inputs}
      setInputs={setInputs}
      schema={schema}
      setSchema={setSchema}
      buttonTxt="Clone"
      func={cloneResource}
    >
      {loading && (
        <Stack direction="column" spacing={3} mt={4}>
          <LinearProgress sx={{ mb: -2 }} />
          <Typography component="p" color="primary" align="center">
            Cloning Data...
          </Typography>
        </Stack>
      )}
    </CommonResourceModal>
  );
};

export default CloneModal;
