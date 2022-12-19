import React, { useEffect, useState } from "react";
import CustomModal from "../../../components/CustomModal";
import { Button, Stack, TextField, Typography } from "@mui/material";

const ConfirmDeleteModal = ({
  confirmDeleteModal,
  setConfirmDeleteModal,
  project,
  deleteProject,
}) => {
  const [formData, setFormData] = useState("");
  const [disabled, setDisabled] = useState(true);

  const checkProjectName = () => {
    if (project.name === formData) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  useEffect(() => {
    checkProjectName();
  }, [formData]);

  return (
    <CustomModal open={confirmDeleteModal} setOpen={setConfirmDeleteModal}>
      <Typography variant="h4" component="h2" color="primary" sx={{ mb: 3 }}>
        Delete Project
      </Typography>
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        This action cannot be undone. This will permanently delete the{" "}
        <i>
          <b>{project.name}</b>
        </i>{" "}
        project and it's associated resources.
      </Typography>
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        Please type{" "}
        <i>
          <b>{project.name}</b>
        </i>{" "}
        to confirm.
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

export default ConfirmDeleteModal;
