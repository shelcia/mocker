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
  IconButton,
  Stack,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import Topbar from "../components/Topbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { blue } from "@mui/material/colors";
import { BACKEND_URL } from "../services/api";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [projects, setProjects] = useState([]);

  const { userId } = useParams();

  const fetchProjects = (signal) => {
    axios
      .get(`${BACKEND_URL}project/${userId}`, {
        signal: signal,
      })
      .then((res) => {
        if (res.data.status === "200") {
          setProjects(res.data.message);
          // toast.success(res.data.message);
          // setOpen(false);
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

    axios.post(`${BACKEND_URL}project`, body).then((res) => {
      if (res.data.status === "200") {
        toast.success(res.data.message);
        setOpen(false);
        // navigate(`/${res.data.message.userId}`);
      }
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <React.Fragment>
      <Topbar />

      <Card sx={{ p: 4, m: 4 }}>
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
                alignItems="flex-start"
                key={project._id}
                component={Link}
                to={`/${userId}/${project._id}`}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[500] }}>
                    {project?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <Typography
                  sx={{ display: "inline", mt: 2 }}
                  component="h1"
                  variant="h6"
                  color="text.primary"
                >
                  {project.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            color="primary"
            sx={{ mb: 2 }}
          >
            New Project
          </Typography>
          <TextField
            label="Project name"
            sx={{ mb: 2 }}
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="API Prefix (optional)"
            sx={{ mb: 2 }}
            size="small"
            fullWidth
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
          <Stack direction="row" spacing={3}>
            <Button variant="contained" size="small" onClick={addProject}>
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

          {/* <Typography variant="h6" component="h2" color="primary">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default Dashboard;
