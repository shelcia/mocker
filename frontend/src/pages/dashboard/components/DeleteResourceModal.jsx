import React from "react";
import CustomModal from "../../../components/CustomModal";
import { Button, Stack } from "@mui/material";

const DeleteResourceModal = ({ open, setOpen, result, delResource }) => (
  <CustomModal
    open={open}
    setOpen={setOpen}
    title="Delete Resource"
    width={600}
  >
    Are you sure you want to delete resource ?
    <Stack direction="row" sx={{ mt: 2 }}>
      <Button
        color="error"
        variant="contained"
        onClick={() => {
          delResource(result);
          setOpen(false);
        }}
      >
        Yes delete please !
      </Button>
      <Button
        color="secondary"
        variant="contained"
        onClick={() => setOpen(false)}
        sx={{ ml: 2 }}
      >
        Cancel
      </Button>
    </Stack>
  </CustomModal>
);

export default DeleteResourceModal;
