import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
import { blue } from "@mui/material/colors";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";

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
    const newArr = schema.map((obj) => {
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
      console.log(res);
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
    axios
      .get(`${BACKEND_URL}resource/project/${projectId}`, { signal: signal })
      .then((res) => {
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
            <p>https://6374d27808104a9c5f8a497c.mockapi.io/:api/:endpoint</p>
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    // border: "2px solid #000",
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

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" color="primary" sx={{ mb: 2 }}>
          New Project
        </Typography>
        <TextField
          label="Project name"
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

        {schema.map((item, idx) => (
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
                {choices.map((choice) => (
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
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: blue[500] }}>{resource?.name?.charAt(0)}</Avatar>
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
        <Button variant="contained">
          <FiEye />
        </Button>
        <Button variant="contained" color="info">
          <FiEdit2 />
        </Button>
        <Button variant="contained" color="error">
          <FiTrash />
        </Button>
      </Stack>
    </ListItem>
  );
};
