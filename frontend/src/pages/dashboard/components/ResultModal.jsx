import React from "react";
import { Box, Typography } from "@mui/material";
import JSONPretty from "react-json-pretty";
import CustomModal from "../../../components/CustomModal";
import { grey } from "@mui/material/colors";

const ResultModal = ({ open, setOpen, result }) => {
  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Result
      </Typography>
      <Box sx={{ bgcolor: grey[100], p: 2, overflowX: "auto" }}>
        <JSONPretty id="json-pretty" data={result}></JSONPretty>
      </Box>
    </CustomModal>
  );
};

export default ResultModal;
