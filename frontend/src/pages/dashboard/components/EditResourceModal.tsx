import { useEffect, useState } from 'react';

import { CustomLoadingModalBlock } from '@/components/common';
import { apiResource } from '@/services/models/resourceModal';
import type { ApiStringResponse } from '@/types';

import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import CommonResourceModal from './CommonResourceModal';

export interface Resource {
  name: string;
  number: number;
  userId: string;
  projectId: string;
  id?: string;
  schema?: any[];
  _id?: string;
}

const EditResourceModal = ({ open, setOpen, result, fetchResult }) => {
  const { userId, projectId } = useParams();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<Resource>({
    name: '',
    number: 1,
    userId: userId,
    projectId: projectId,
  });

  const [schema, setSchema] = useState([]);

  const fetchResource = (signal) => {
    apiResource.getSingle(result, signal).then((res: { status: string; message?: Resource }) => {
      // console.log(res.data);
      if (res.status === '200') {
        setInputs({
          name: res.message?.name,
          number: res.message?.number,
          userId: userId,
          projectId: projectId,
          id: res.message._id,
        });
        setSchema(res.message?.schema);
      }
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
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource
      .putById(result, body)
      .then((res: ApiStringResponse) => {
        if (res.status === '200') {
          toast.success('Edited Successfully');
          setOpen(false);
          // fetchResource();
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
