import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Link,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { BACKEND_URL } from "../../services/api";
import { toast } from "react-hot-toast";
import { blue } from "@mui/material/colors";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import { apiResource } from "../../services/models/resourceModal";
import { apiUser } from "../../services/models/userModal";
import { apiProject } from "../../services/models/projectModel";
import ResourceModal from "./components/ResourceModal";
import EndpointModal from "./components/EndpointModal";
import EditResourceModal from "./components/EditResourceModal";
import ResultModal from "./components/ResultModal";

const Collection = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [resources, setResources] = useState([]);

  const navigate = useNavigate();
  const { userId, projectId } = useParams();

  const [inputs, setInputs] = useState({
    name: "",
    number: 1,
    userId: userId,
    projectId: projectId,
  });

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [schema, setSchema] = useState([]);

  const handleSchema = (id, label, field) => {
    const newArr = schema?.map((obj) => {
      if (obj.id === id) {
        return { ...obj, label: label, field: field };
      }
      return obj;
    });
    setSchema(newArr);
    // setSchema([ ...schema, [e.target.name]: e.target.value ]);
  };

  const addSchema = () => {
    setSchema([...schema, { id: Date.now(), label: "", field: "" }]);
  };

  const deleteSchema = (id) => {
    setSchema(schema.filter((item) => item.id !== id));
  };

  const createProject = () => {
    console.log("Hello");
    setLoading(true);
    toast("Adding");

    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    // console.log(body);
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

  const fetchResource = (signal) => {
    // console.log(`${BACKEND_URL}resource/project/${projectId}`);
    apiResource.getSingle(`project/${projectId}`).then((res) => {
      if (res.status === "200") {
        setResources(res.message);
      }
    });
    apiProject.getSingle(`single/${projectId}`).then((res) => {
      if (res.status === "200") {
        // console.log(res.message.name);
        setProjectName(res.message?.name);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
  }, []);

  const delResource = (id) => {
    apiResource.remove(id).then((res) => {
      // console.log(res);
      if (res.status === "200") {
        fetchResource();
      } else {
        toast.error("Error");
      }
    });
  };

  return (
    <React.Fragment>
      <Button onClick={() => navigate(-1)}>
        <MdArrowBackIosNew />
        Back
      </Button>
      <CardContent>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          {projectName}
        </Typography>
        <Alert sx={{ mb: 2 }}>
          <AlertTitle sx={{ fontWeight: 600 }}>API endpoint</AlertTitle>
          <code>{BACKEND_URL}/user/:endpoint</code>
        </Alert>
        <Link
          href="https://documenter.getpostman.com/view/21272376/2s8YmUMLP2#f02f8b5d-1988-4177-816a-6da7fcb47d88"
          target="_blank"
        >
          <Typography component="p" variant="h6" sx={{ mb: 2 }}>
            Postman Documentation
          </Typography>
        </Link>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Resource
        </Button>
        <List sx={{ overflowX: "auto" }}>
          {resources?.map((resource) => (
            <Resource
              key={resource._id}
              resource={resource}
              delResource={delResource}
            />
          ))}
        </List>
      </CardContent>
      <ResourceModal
        open={open}
        setOpen={setOpen}
        inputs={inputs}
        handleInputs={handleInputs}
        schema={schema}
        handleSchema={handleSchema}
        addSchema={addSchema}
        deleteSchema={deleteSchema}
        createProject={createProject}
        loading={loading}
        setLoading={setLoading}
      />
    </React.Fragment>
  );
};

export default Collection;

const Resource = ({ resource, delResource }) => {
  const [openModal, setOpenModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [result, setResult] = useState({});

  const fetchResult = (signal) => {
    apiUser.getSingle(resource._id, signal).then((res) => {
      if (res.status === "200") {
        setResult(res.message);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResult(ac.signal);
    return () => ac.abort();
  }, []);

  return (
    <React.Fragment>
      <ListItem sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blue[500] }}>
              {resource?.name?.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <Typography
            sx={{ display: "inline", mt: 1 }}
            component="h1"
            variant="h6"
            color="text.primary"
          >
            {resource?.name}
          </Typography>
        </Box>

        <Box>
          <Stack spacing={2} direction="row" sx={{ mt: 1.8, ml: 6 }}>
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              <FiEye />
            </Button>
            <Button variant="outlined" onClick={() => setEditModal(true)}>
              <FiEdit2 />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => delResource(resource._id)}
            >
              <FiTrash />
            </Button>
            <Button variant="contained" onClick={() => setEndModal(true)}>
              View Endpoints
            </Button>
          </Stack>
        </Box>
      </ListItem>
      <ResultModal open={openModal} setOpen={setOpenModal} result={result} />
      <EndpointModal
        open={endModal}
        setOpen={setEndModal}
        result={resource._id}
      />
      <EditResourceModal
        open={editModal}
        setOpen={setEditModal}
        result={resource._id}
        fetchResult={fetchResult}
      />
    </React.Fragment>
  );
};
