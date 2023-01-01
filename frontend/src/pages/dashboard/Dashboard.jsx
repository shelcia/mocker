import React, { useEffect, useState, useContext } from "react";
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
  Checkbox,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { blue } from "@mui/material/colors";
import { apiProject } from "../../services/models/projectModel";
import CustomModal from "../../components/CustomModal";
import { FiTrash } from "react-icons/fi";
import { MdDriveFileRenameOutline } from "react-icons/md";
import * as Yup from "yup";
import { useFormik } from "formik";
import ConfirmDeleteModal from "./components/ConfirmDelProjectModal";
import { PartLoader } from "../../components/CustomLoading";
import { apiProvider } from "../../services/utilities/provider";
import { ThemeContext } from "../../context/ThemeContext";

const Dashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [darkTheme] = useContext(ThemeContext);

  const [projects, setProjects] = useState([]);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState({});

  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [projectToBeRename, setProjectToBeRename] = useState({});
  const [checkedList, setCheckedList] = useState([])
  const [isMultipleDelete, setIsMultipleDelete] = useState(false)

  const initialValues = {
    name: "",
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Project should be of minimum 3 characters length")
      .max(25)
      .required("Project Name is required"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        addProject(values.name);
      },
    });

  const addProject = (name) => {
    const body = {
      name: name,
      userId: userId,
    };

    apiProject.post(body).then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
        setOpen(false);
        values.name = "";
        fetchProjects();
      } else {
        toast.error(res.message);
      }
    });
  };

  const fetchProjects = () => {
    const ac = new AbortController();
    const signal = ac.signal;
    apiProject.getSingle(userId, signal).then((res) => {
      if (res.status === "200") {
        // console.log(res);
        setLoading(false);
        setProjects(res.message);
      } else {
        toast.error("Error !");
        setLoading(false);
      }
    });
    return () => ac.abort();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const delProject = (id) => {
    toast("Deleting !");
    apiProject.remove(id).then((res) => {
      if (res.status === "200") {
        fetchProjects();
      }
    });
    setConfirmDeleteModal(false);
  };

  const handleChecked = (e, id)=>{
    let newCheckList = e.target.checked?
    [...checkedList, id] : checkedList.filter((_id)=>_id!=id)

    setCheckedList(newCheckList)
  }

  const delSelected = ()=>{
    const body = {
      projects: checkedList,
    }
    toast.promise(new Promise((resolve, reject)=>{
      apiProject.removeAll(body)
      .then((res)=>{
        if(res.status==="200"){
          fetchProjects()
          setCheckedList([])
          resolve(res.message)
        }
        reject(res.message)
      })
      setConfirmDeleteModal(false);
    }),
    {
      loading: "Deleting",
      success: message => message,
      error: err => err,
    })
  }

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
        {loading ? (
          <PartLoader />
        ) : (
          <List>
            {Array.isArray(projects) &&
              projects.map((project) => (
                <ListItem
                  sx={{ justifyContent: "space-between" }}
                  key={project._id}
                >
                  <Stack direction={"row"}>
                    <Checkbox
                      sx={{color:darkTheme?"#1c1c1c":"#dbdbdb",
                        ":hover": {color:darkTheme?"#e8e8e8":"#1c1c1c"}}}
                      onChange={(e)=>{handleChecked(e, project._id)}}
                    />
                    <Box
                      sx={{ display: "flex", cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/dashboard/${userId}/${project._id}`)
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: blue[500],
                            ":hover": { bgcolor: blue[800] },
                          }}
                        >
                          {project?.name?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <Typography
                        sx={{
                          display: "inline",
                          mt: 1,
                          ":hover": { color: blue[800] },
                        }}
                        component="h1"
                        variant="h6"
                        color="text.primary"
                      >
                        {project.name}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction={"row"} spacing={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setProjectToBeRename(project)
                        setRenameModalOpen(true)
                      }}
                    >
                      <MdDriveFileRenameOutline color="#fff" />
                    </Button>
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
                  </Stack>
                </ListItem>
              ))}
              {checkedList.length!==0 &&
              <Button
                sx={{ mt: 2 }}
                onClick={()=>{
                  setConfirmDeleteModal(true);
                  setIsMultipleDelete(true)
                }}
                variant="contained"
                color="error">
                  Delete selected
              </Button>
        }
          </List>
        )}
      </CardContent>
      {open && (
        <CustomModal open={open} setOpen={setOpen} title="New Project">
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Project name"
              type="text"
              name="name"
              sx={{ mb: 3 }}
              size="small"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name || ""}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />
            <Stack direction="row" spacing={3}>
              <Button variant="contained" size="small" type="submit">
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
          </Box>
        </CustomModal>
      )}
      <ConfirmDeleteModal
        confirmDeleteModal={confirmDeleteModal}
        setConfirmDeleteModal={setConfirmDeleteModal}
        project={toBeDeleted}
        deleteProject={delProject}
        isMultipleDelete = {isMultipleDelete}
        setIsMultipleDelete = {setIsMultipleDelete}
        delSelected = {delSelected}
      />
      <RenameModal
        fetchProjects={fetchProjects}
        setRenameModalOpen={setRenameModalOpen}
        projectToBeRename={projectToBeRename}
        renameModalOpen={renameModalOpen}
      />
    </React.Fragment>
  );
};

export default Dashboard;


export const RenameModal = ({
  fetchProjects,
  projectToBeRename,
  renameModalOpen,
  setRenameModalOpen
}) => {

  const renameProject = (values, id) => {
    setRenameModalOpen(false)
    toast.promise(new Promise((resolve, reject) => {
      apiProvider.putById("project/single", id, {
        name: values.name,
      })
      .then((res) => {
        if (res.status === "200") {
          fetchProjects()
          resolve(res)
        }
        reject()
      })
    }),
      {
        loading: "Renaming...",
        success: res => res.message,
        error: "Rename failed",
      })
  }

  const initialValues = {
    name: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Project should be of minimum 3 characters length")
      .max(25)
      .required("Project Name is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      renameProject(values, projectToBeRename._id)
    },
  });

  useEffect(()=>{
    formik.setValues({
      name: projectToBeRename.name,
    })
  },[projectToBeRename])

  return (
    <React.Fragment>
      {renameModalOpen && (
        <CustomModal open={renameModalOpen} setOpen={setRenameModalOpen} title="Rename project">
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              label="Project rename"
              type="text"
              name="name"
              sx={{ mb: 3 }}
              size="small"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name || ""}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Stack direction="row" spacing={3}>
              <Button variant="contained" size="small" type="submit">
                Rename
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setRenameModalOpen(false)
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </CustomModal>
      )}
    </React.Fragment>
  )
}