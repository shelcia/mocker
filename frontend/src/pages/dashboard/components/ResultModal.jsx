import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import JSONPretty from "react-json-pretty";
import CustomModal from "../../../components/CustomModal";
import { grey } from "@mui/material/colors";
import { ThemeContext } from "../../../context/ThemeContext";
import { MdOutlineContentCopy } from "react-icons/md";
import { CopyButton } from "../../../components/CustomButtons";
import { toast } from "react-hot-toast";

const ResultModal = ({ open, setOpen, result }) => {
  const [darkTheme] = useContext(ThemeContext);

  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(JSON.stringify(result))
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        toast.success("Copied !");
        setTimeout(() => {
          setIsCopied(false);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't copy !");
      });
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Result
      </Typography>
      <Box
        sx={{
          bgcolor: darkTheme ? grey[900] : grey[100],
          p: 2,
          overflowX: "auto",
        }}
      >
        <CopyButton
          onClick={handleCopyClick}
          sx={{ marginLeft: "90%" }}
          disabled={isCopied}
        >
          {isCopied ? "Done" : "Copy"}
        </CopyButton>
        <JSONPretty id="json-pretty" data={result}></JSONPretty>
      </Box>
    </CustomModal>
  );
};

export default ResultModal;
