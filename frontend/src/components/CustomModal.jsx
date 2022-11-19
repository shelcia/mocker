import React from "react";
import { Box, Modal } from "@mui/material";

const CustomModal = ({ open, setOpen, width = 400, children }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;
