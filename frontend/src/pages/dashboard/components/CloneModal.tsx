import React, { useEffect, useState } from 'react';

import { CustomLoadingModalBlock } from '@/components/common';
import { apiResource } from '@/services/models/resourceModal';
import type { Resource, RouteParams, SchemaItem } from '@/types';
import { isApiResponse } from '@/types';

import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import CommonResourceModal from './CommonResourceModal';

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

  const [inputs, setInputs] = useState<Resource>({
    name: '',
    number: 1,
    userId,
    projectId,
  });

  const [schema, setSchema] = useState<SchemaItem[]>([]);

  const fetchResource = (signal: AbortSignal) => {
    apiResource.getSingle(result, signal).then((res) => {
      if (!isApiResponse(res) || res.status !== '200') return;

      const msg = res.message as Resource | undefined;

      setInputs({
        name: msg?.name ?? '',
        number: Number(msg?.number ?? 1),
        userId,
        projectId,
        id: msg?._id,
      });
      setSchema((msg?.schema ?? []) as SchemaItem[]);
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
      const res = await apiResource.post(body);

      if (!isApiResponse(res)) {
        toast.error('Error');
        setOpen(false);

        return;
      }

      if (res.status === '200') {
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
      {loading && <CustomLoadingModalBlock text="Cloning resource..." />}
    </CommonResourceModal>
  );
};

export default CloneModal;
