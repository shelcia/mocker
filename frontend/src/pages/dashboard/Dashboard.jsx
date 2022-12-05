import React, { useEffect, useState } from "react";
import {
  Button,
  CardContent,
  Typography,
  TextField,
  Stack,
  ListItem,
  ListItemAvatar,
  Avatar,
  List,
  Box,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { blue, deepOrange } from "@mui/material/colors";
import { apiProject } from "../../services/models/projectModel";
import CustomModal from "../../components/CustomModal";
import { FiTrash } from "react-icons/fi";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [projects, setProjects] = useState([]);

  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchProjects = (signal) => {
    apiProject.getSingle(userId, signal).then((res) => {
      if (res.status === "200") {
        setProjects(res.message);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchProjects(ac.signal);
    return () => ac.abort();
  });

  const addProject = () => {
    const body = {
      name: name,
      prefix: prefix,
      userId: userId,
    };

    apiProject.post(body).then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const delProject = (id) => {
    toast("Deleting !");
    apiProject.remove(id).then((res) => {
      if (res.status === "200") {
        fetchProjects();
      }
    });
  };

  return (
    <React.Fragment>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Typography variant="h5" component="h1" color="primary">
            Projects
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            sx={{ borderRadius: "50ex", py: 0.2, px: 1.2, minWidth: 0 }}
            onClick={() => setOpen(true)}
          >
            <FaPlus size={"0.8rem"} />
          </Button>
        </Stack>
        <List>
          {projects.map((project) => (
            <ListItem
              sx={{ justifyContent: "space-between" }}
              key={project._id}
            >
              <Box
                sx={{ display: "flex", cursor: "pointer" }}
                onClick={() => navigate(`/${userId}/${project._id}`)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[500],":hover":{bgcolor:blue[800]}}}>
                    {project?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <Typography
                  sx={{ display: "inline", mt: 1, ":hover":{color:blue[800]}}}
                  component="h1"
                  variant="h6"
                  color="text.primary"
                >
                  {project.name}
                </Typography>
              </Box>
              <Button
                color="error"
                variant="contained"
                onClick={() => delProject(project._id)}
              >
                <FiTrash color="#fff" />
              </Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <NewProjectModal
        open={open}
        setOpen={setOpen}
        name={name}
        setName={setName}
        addProject={addProject}
      />
    </React.Fragment>
  );
};

export default Dashboard;

const NewProjectModal = ({ open, setOpen, name, setName, addProject }) => {
  return (
    <CustomModal open={open} setOpen={setOpen}>
      <Typography variant="h4" component="h2" color="primary" sx={{ mb: 3 }}>
        New Project
      </Typography>
      <TextField
        label="Project name"
        sx={{ mb: 3 }}
        size="small"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* <TextField
      label="API Prefix (optional)"
      sx={{ mb: 2 }}
      size="small"
      fullWidth
      value={prefix}
      onChange={(e) => setPrefix(e.target.value)}
    /> */}
      <Stack direction="row" spacing={3}>
        <Button variant="contained" size="small" onClick={addProject}>
          Create
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            setOpen(false);
            setName("");
          }}
        >
          Cancel
        </Button>
      </Stack>
    </CustomModal>
  );
};
