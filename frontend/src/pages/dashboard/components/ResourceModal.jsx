import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiResource } from "../../../services/models/resourceModal";
import CommonResourceModal from "./CommonResourceModal";

const ResourceModal = ({
  open,
  setOpen,
  fetchResource,
  loading,
  setLoading,
}) => {
  const { userId, projectId } = useParams();

  const [inputs, setInputs] = useState({
    name: "",
    number: 1,
    userId: userId,
    projectId: projectId,
  });

  const [schema, setSchema] = useState([]);

  const createProject = () => {
    setLoading(true);
    toast("Adding");

    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource.post(body).then((res) => {
      // console.log(res);
      if (res.status === "200") {
        toast.success("Added Successfully");
        fetchResource();
        setSchema([]);
        setInputs({
          name: "",
          number: 1,
          userId: userId,
          projectId: projectId,
        });
        setLoading(false);
        setOpen(false);
      } else {
        setOpen(false);
        toast.error("Error");
      }
    });
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
          <Typography variant="p" component="p" color="primary" align="center">
            Generating Data...
          </Typography>
        </Stack>
      )}
    </CommonResourceModal>
  );
};

export default ResourceModal;
