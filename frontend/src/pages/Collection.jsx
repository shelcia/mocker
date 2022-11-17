import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Box,
  Modal,
  Typography,
  TextField,
  Alert,
  AlertTitle,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import Topbar from "../components/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import axios from "axios";
import { BACKEND_URL } from "../services/api";
import { toast } from "react-hot-toast";
import { blue, green, grey } from "@mui/material/colors";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import JSONPretty from "react-json-pretty";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "scroll",
};

const choices = [
  "firstName",
  "lastName",
  "sex",
  "jobArea",
  "jobTitle",
  "avatar",
  "fashion",
  "product",
  "productDescription",
  "price",
  "productAdjective",
  "boolean",
  "past",
  "lines",
  "domainName",
  "imageUrl",
  "sentences",
];

const Collection = () => {
  const [open, setOpen] = useState(false);

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
    // const newSchema = schema.filter((item)=> item.id !== id)

    setSchema(schema.filter((item) => item.id !== id));
  };

  const createProject = () => {
    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    // console.log(body);
    axios.post(`${BACKEND_URL}resource`, body).then((res) => {
      // console.log(res);
      if (res.data.status === "200") {
        toast.success("Added Successfully");
        setOpen(false);
        fetchResource();
      } else {
        toast.error("Error");
        setOpen(false);
      }
    });
  };

  const fetchResource = (signal) => {
    // console.log(`${BACKEND_URL}resource/project/${projectId}`);
    axios.get(`${BACKEND_URL}resource/project/${projectId}`).then((res) => {
      // console.log(res);
      if (res.data.status === "200") {
        setResources(res.data.message);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
  }, []);

  return (
    <React.Fragment>
      <Topbar />
      <Card sx={{ m: 4, p: 4 }}>
        <Button onClick={() => navigate(-1)}>
          <MdArrowBackIosNew />
          Back
        </Button>
        <CardContent>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Project Name
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>API endpoint</AlertTitle>
            <b>http://localhost:4050/api/user/:endpoint</b>
          </Alert>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Resource
          </Button>
          <List>
            {resources?.map((resource) => (
              <Resource key={resource._id} resource={resource} />
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
        />
      </Card>
    </React.Fragment>
  );
};

export default Collection;

const ResourceModal = ({
  open,
  setOpen,
  inputs,
  handleInputs,
  schema,
  handleSchema,
  addSchema,
  deleteSchema,
  createProject,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
          New Resource
        </Typography>
        <TextField
          label="Resource name"
          sx={{ mb: 2 }}
          size="small"
          fullWidth
          name="name"
          value={inputs.name}
          onChange={(e) => handleInputs(e)}
        />
        <TextField
          label="Number of Objects"
          sx={{ mb: 2 }}
          size="small"
          fullWidth
          name="number"
          value={inputs.number}
          onChange={(e) => handleInputs(e)}
        />

        <Stack direction="row" spacing={1}>
          <TextField value="id" sx={{ mb: 2 }} size="small" disabled />
          <TextField value="uuid" sx={{ mb: 2 }} size="small" disabled />
        </Stack>

        {schema?.map((item, idx) => (
          <Stack direction="row" spacing={1} key={item.id}>
            <TextField
              sx={{ mb: 2 }}
              size="small"
              value={item.label}
              label="Label"
              onChange={(e) =>
                handleSchema(item.id, e.target.value, item.field)
              }
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Field</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ mb: 2 }}
                size="small"
                label="Field"
                value={item.field}
                onChange={(e) =>
                  handleSchema(item.id, item.label, e.target.value)
                }
              >
                {choices?.map((choice) => (
                  <MenuItem value={choice} key={choice}>
                    {choice}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteSchema(item.id)}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        ))}

        <Button onClick={addSchema} variant="contained" size="small">
          Add Resource
        </Button>

        <Stack direction="row" spacing={3} mt={2}>
          <Button variant="contained" size="small" onClick={createProject}>
            Create
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

const Resource = ({ resource }) => {
  const [openModal, setOpenModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [result, setResult] = useState({});

  const fetchResult = () => {
    axios.get(`${BACKEND_URL}user/${resource._id}`).then((res) => {
      if (res.data.status === "200") {
        setResult(res.data.message);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResult();
    return () => ac.abort();
  }, []);

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[500] }}>
            {resource?.name?.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <Typography
          sx={{ display: "inline", mt: 2 }}
          component="h1"
          variant="h6"
          color="text.primary"
        >
          {resource?.name}
        </Typography>
        <Stack spacing={2} direction="row" sx={{ mt: 1.8, ml: 6 }}>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            <FiEye />
          </Button>
          <Button variant="outlined" onClick={() => setEditModal(true)}>
            <FiEdit2 />
          </Button>
          <Button variant="contained" color="error">
            <FiTrash />
          </Button>
          <Button variant="contained" onClick={() => setEndModal(true)}>
            View Endpoints
          </Button>
        </Stack>
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

const ResultModal = ({ open, setOpen, result }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
          Result
        </Typography>
        <Box sx={{ bgcolor: grey[300], p: 2, overflowX: "auto" }}>
          <JSONPretty id="json-pretty" data={result}></JSONPretty>
        </Box>
      </Box>
    </Modal>
  );
};

const EndpointModal = ({ open, setOpen, result }) => {
  // console.log(result);

  const points = [
    {
      method: "GET",
      endpoint: ``,
    },
    {
      method: "GET",
      endpoint: `/:id`,
    },
    {
      method: "POST",
      endpoint: ``,
    },
    {
      method: "PUT",
      endpoint: `/:id`,
    },
    {
      method: "DELETE",
      endpoint: `/:id`,
    },
  ];

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
          Endpoints
        </Typography>
        <Box sx={{ bgcolor: grey[100], p: 2 }}>
          <List>
            {points?.map((point, idx) => (
              <ListItem key={idx}>
                <Stack direction="row" spacing={3}>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ color: green[500], fontWeight: 800 }}
                  >
                    {point.method}
                  </Typography>
                  {"    "} -
                  <Typography variant="caption" component="p">
                    /{result}
                    {point.endpoint}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

const EditResourceModal = ({ open, setOpen, result, fetchResult }) => {
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
  };

  const addSchema = () => {
    setSchema([...schema, { id: Date.now(), label: "", field: "" }]);
  };

  const deleteSchema = (id) => {
    setSchema(schema.filter((item) => item.id !== id));
    // setInputs();
  };

  const fetchResource = (signal) => {
    // console.log(`${BACKEND_URL}resource/project/${projectId}`);
    axios.get(`${BACKEND_URL}resource/${result}`).then((res) => {
      // console.log(res.data);
      if (res.data.status === "200") {
        setInputs({
          name: res.data.message?.name,
          number: res.data.message?.number,
          userId: userId,
          projectId: projectId,
          id: res.data.message._id,
        });
        setSchema(res.data.message?.schema);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
  }, []);

  const updateResource = () => {
    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    axios.put(`${BACKEND_URL}resource/${result}`, body).then((res) => {
      // console.log(res);
      if (res.data.status === "200") {
        toast.success("Edited Successfully");
        setOpen(false);
        fetchResource();
        fetchResult();
      } else {
        toast.error("Error");
        setOpen(false);
      }
    });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
          Update Resource
        </Typography>
        <TextField
          label="Resource name"
          sx={{ mb: 2 }}
          size="small"
          fullWidth
          name="name"
          value={inputs.name}
          onChange={(e) => handleInputs(e)}
        />
        <TextField
          label="Number of Objects"
          sx={{ mb: 2 }}
          size="small"
          fullWidth
          name="number"
          value={inputs.number}
          onChange={(e) => handleInputs(e)}
        />

        <Stack direction="row" spacing={1}>
          <TextField value="id" sx={{ mb: 2 }} size="small" disabled />
          <TextField value="uuid" sx={{ mb: 2 }} size="small" disabled />
        </Stack>

        {schema?.map((item, idx) => (
          <Stack direction="row" spacing={1} key={item.id}>
            <TextField
              sx={{ mb: 2 }}
              size="small"
              value={item.label}
              label="Label"
              onChange={(e) =>
                handleSchema(item.id, e.target.value, item.field)
              }
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Field</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ mb: 2 }}
                size="small"
                label="Field"
                value={item.field}
                onChange={(e) =>
                  handleSchema(item.id, item.label, e.target.value)
                }
              >
                {choices?.map((choice) => (
                  <MenuItem value={choice} key={choice}>
                    {choice}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteSchema(item.id)}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        ))}

        <Button onClick={addSchema} variant="contained" size="small">
          Add Resource
        </Button>

        <Stack direction="row" spacing={3} mt={2}>
          <Button variant="contained" size="small" onClick={updateResource}>
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
