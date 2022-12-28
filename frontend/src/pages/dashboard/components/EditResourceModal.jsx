import React, { useEffect, useState } from "react";
import { apiResource } from "../../../services/models/resourceModal";
import CommonResourceModal from "./CommonResourceModal";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Stack,
  LinearProgress,
  Typography
} from '@mui/material'

const EditResourceModal = ({ open, setOpen, result, fetchResult }) => {
  const { userId, projectId } = useParams();
  const [loading, setLoading] = useState(false)

  const [inputs, setInputs] = useState({
    name: "",
    number: 1,
    userId: userId,
    projectId: projectId,
  });

  const [schema, setSchema] = useState([]);

  const fetchResource = (signal) => {
    apiResource.getSingle(result, signal).then((res) => {
      // console.log(res.data);
      if (res.status === "200") {
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
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource.putById(result, body).then((res) => {
      if (res.status === "200") {
        toast.success("Edited Successfully");
        setOpen(false);
        // fetchResource();
        fetchResult();
      } else {
        toast.error("Error");
        setOpen(false);
      }
    })
    .finally(()=>{
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
    {loading && (
      <Stack direction="column" spacing={3} mt={4}>
        <LinearProgress sx={{ mb: -2 }} />
        <Typography variant="p" component="p" color="primary" align="center">
          Updating Data...
        </Typography>
      </Stack>
    )}
    </CommonResourceModal>
  );
};

export default EditResourceModal;
