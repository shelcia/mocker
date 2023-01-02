import React, { useEffect, useState } from "react";
import CustomModal from "../../../components/CustomModal";
import { Button, Stack, TextField, Typography } from "@mui/material";

const ConfirmDeleteModal = ({
  confirmDeleteModal,
  setConfirmDeleteModal,
  project,
  deleteProject,
  isMultipleDelete = false,
  setIsMultipleDelete,
  delSelected = () => {},
}) => {
  const [formData, setFormData] = useState("");
  const [disabled, setDisabled] = useState(true);

  const checkProjectName = () => {
    if (isMultipleDelete) {
      if ("DELETE" === formData) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
      return;
    }
    if (project.name === formData) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  useEffect(() => {
    checkProjectName();
  }, [formData]);

  useEffect(() => {
    //Set multiple delete to false on closing
    confirmDeleteModal || setIsMultipleDelete(false);
  }, [confirmDeleteModal]);

  return (
    <CustomModal
      open={confirmDeleteModal}
      setOpen={setConfirmDeleteModal}
      title="Delete Project"
    >
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        This action cannot be undone. This will permanently delete the{" "}
        <i>{isMultipleDelete ? "selected" : <b>{project.name}</b>}</i>{" "}
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        project and it's associated resources.
      </Typography>
      <Typography variant="p" component="p" color="text.primary" sx={{ mb: 3 }}>
        Please type{" "}
        <i>
          <b>{isMultipleDelete ? "DELETE" : project.name}</b>
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
            isMultipleDelete ? delSelected() : deleteProject(project._id);
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
