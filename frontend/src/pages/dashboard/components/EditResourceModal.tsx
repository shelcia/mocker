import React, { useEffect, useState } from 'react';

import { CustomLoadingModalBlock } from '@/components/common';
import { apiResource } from '@/services/models/resourceModal';
import type { Resource, RouteParams, SchemaItem } from '@/types';
import { isApiResponse } from '@/types';

import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import CommonResourceModal from './CommonResourceModal';

interface EditResourceModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** resource id to edit */
  result: string;
  fetchResult: () => void;
}

const EditResourceModal = ({ open, setOpen, result, fetchResult }: EditResourceModalProps) => {
  const { userId, projectId } = useParams<RouteParams>();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<Resource>({
    name: '',
    number: 1,
    userId: userId ?? '',
    projectId: projectId ?? '',
  });

  const [schema, setSchema] = useState<SchemaItem[]>([]);

  const fetchResource = (signal: AbortSignal) => {
    apiResource.getSingle(result, signal).then((res) => {
      if (!isApiResponse(res) || res.status !== '200') return;

      const msg = res.message as Resource | undefined;

      setInputs({
        name: msg?.name ?? '',
        number: msg?.number ?? 1,
        userId: userId ?? '',
        projectId: projectId ?? '',
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

  const updateResource = () => {
    setLoading(true);
    const body = {
      name: inputs.name,
      number: inputs.number,
      userId: userId ?? '',
      projectId: projectId ?? '',
      schema: schema,
    };

    apiResource
      .putById(result, body)
      .then((res) => {
        if (!isApiResponse(res)) {
          toast.error('Error');
          setOpen(false);

          return;
        }

        if (res.status === '200') {
          toast.success('Edited Successfully');
          setOpen(false);
          fetchResult();
        } else {
          toast.error('Error');
          setOpen(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CommonResourceModal
      open={open}
      setOpen={setOpen}
      title="Update Resource"
      inputs={inputs}
      setInputs={setInputs}
      schema={schema}
      setSchema={setSchema}
      buttonTxt="Update"
      func={updateResource}
    >
      {loading && <CustomLoadingModalBlock text="Updating resource..." />}
    </CommonResourceModal>
  );
};

export default EditResourceModal;
