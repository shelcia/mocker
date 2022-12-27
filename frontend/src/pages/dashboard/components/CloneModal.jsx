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

const CloneModal = ({ open, setOpen, result, fetchResources }) => {
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

  const cloneResource = () => {
    setLoading(true);
    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource
      .post(body)
      .then((res) => {
        // console.log(res);
        if (res.status === "200") {
          toast.success("Cloned Successfully");
          setOpen(false);
          fetchResources();
        } else {
          setOpen(false);
          toast.error("Error");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error");
      })
      .finally(()=>{
        setLoading(false);
      });
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
        <Typography variant="p" component="p" color="primary" align="center">
          Cloning Data...
        </Typography>
      </Stack>
    )}
    </CommonResourceModal>
  );
};

export default CloneModal;
