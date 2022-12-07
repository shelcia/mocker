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
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState({});
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [projects, setProjects] = useState([]);

  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchProjects = () => {
    const ac = new AbortController();
    const signal = ac.signal
    apiProject.getSingle(userId, signal).then((res) => {
      if (res.status === "200") {
        setProjects(res.message);
      }
    });
    return () => ac.abort();
  };


  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = () => {
    const body = {
      name: name,
      prefix: prefix,
      userId: userId,
    };

    apiProject.post(body).then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
        fetchProjects()
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const delProject = (id) => {
    toast("Deleting !");
    apiProject.remove(id).then((res) => {
      setConfirmDeleteModal(false);
      if (res.status === "200") {
        fetchProjects();
      }
    });
  };

  return (
    <React.Fragment>
      <CardContent>
        <Stack direction="row" spacing={ 2 }>
          <Typography variant="h5" component="h1" color="primary">
            Projects
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            sx={ { borderRadius: "50ex", py: 0.2, px: 1.2, minWidth: 0 } }
            onClick={ () => setOpen(true) }
          >
            <FaPlus size={ "0.8rem" } />
          </Button>
        </Stack>
        <List>
          { projects && projects.map((project) => (
            <ListItem
              sx={ { justifyContent: "space-between" } }
              key={ project._id }
            >
              <Box
                sx={ { display: "flex", cursor: "pointer" } }
                onClick={ () => navigate(`/${userId}/${project._id}`) }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[500], ":hover": { bgcolor: blue[800] } }}>
                    {project?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <Typography
                  sx={{ display: "inline", mt: 1, ":hover": { color: blue[800] } }}
                  component="h1"
                  variant="h6"
                  color="text.primary"
                >
                  { project.name }
                </Typography>
              </Box>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  setToBeDeleted(project);
                  setConfirmDeleteModal(true);
                }}
              >
                <FiTrash color="#fff" />
              </Button>
            </ListItem>
          )) }
        </List>
      </CardContent>
      <NewProjectModal
        open={ open }
        setOpen={ setOpen }
        name={ name }
        setName={ setName }
        addProject={ addProject }
      />
      <ConfirmDeleteModal
        confirmDeleteModal={confirmDeleteModal}
        setConfirmDeleteModal={setConfirmDeleteModal}
        deleteProject={delProject}
        project={toBeDeleted}
      />
    </React.Fragment>
  );
};

export default Dashboard;

const NewProjectModal = ({ open, setOpen, name, setName, addProject }) => {
  return (
    <CustomModal open={ open } setOpen={ setOpen }>
      <Typography variant="h4" component="h2" color="primary" sx={ { mb: 3 } }>
        New Project
      </Typography>
      <TextField
        label="Project name"
        sx={ { mb: 3 } }
        size="small"
        fullWidth
        value={ name }
        onChange={ (e) => setName(e.target.value) }
      />
      {/* <TextField
      label="API Prefix (optional)"
      sx={{ mb: 2 }}
      size="small"
      fullWidth
      value={prefix}
      onChange={(e) => setPrefix(e.target.value)}
    /> */}
      <Stack direction="row" spacing={ 3 }>
        <Button variant="contained" size="small" onClick={ addProject }>
          Create
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={ () => {
            setOpen(false);
            setName("");
          } }
        >
          Cancel
        </Button>
      </Stack>
    </CustomModal>
  );
};


const ConfirmDeleteModal = ({ confirmDeleteModal, setConfirmDeleteModal, project, deleteProject }) => {

  const [formData, setFormData] = useState("");
  const [disabled, setDisabled] = useState(true);

  const checkProjectName = () => {
    if (project.name === formData) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  useEffect(() => {
    checkProjectName();
  }, [formData])


  return (
    <CustomModal open={confirmDeleteModal} setOpen={setConfirmDeleteModal}>
      <Typography variant="h4" component="h2" color="primary" sx={{ mb: 3 }}>
        Delete Project
      </Typography>
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        This action cannot be undone. This will permanently delete the <i><b>{project.name}</b></i> project and it's associated resources.
      </Typography>
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        Please type <i><b>{project.name}</b></i> to confirm.
      </Typography>

      <TextField
        label="Project name"
        sx={{ mb: 3 }}
        size="small"
        fullWidth
        value={formData}
        onChange={(e) => {
          setFormData(e.target.value);
          checkProjectName();
        }}
      />

      <Stack direction="row" spacing={3}>
        <Button
          variant="contained"
          disabled={disabled}
          color="error"
          size="wide"
          onClick={() => {
            deleteProject(project._id);
            setFormData("");
            setDisabled(true);
          }}
        >
          Confirm Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setFormData("");
            setDisabled(true);
            setConfirmDeleteModal(false);
          }}
        >
          Cancel
        </Button>
      </Stack>

    </CustomModal>
  );
};
