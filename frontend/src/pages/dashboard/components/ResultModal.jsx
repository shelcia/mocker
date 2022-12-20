import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import JSONPretty from "react-json-pretty";
import CustomModal from "../../../components/CustomModal";
import { grey } from "@mui/material/colors";
import { ThemeContext } from "../../../context/ThemeContext";
import { CopyButton } from "../../../components/CustomButtons";
import { toast } from "react-hot-toast";
import { secondary } from "../../../themes/themeColors";
import { copyTextToClipboard } from "../../../utils/utils";
import { PartLoader } from "../../../components/CustomLoading";
import json_beutify from "json-beautify";

const ResultModal = ({ open, setOpen, result, loading }) => {
  const [darkTheme] = useContext(ThemeContext);
  // const [isCopied, setIsCopied] = useState(false);
  const [isBeautifyCopied, setIsBeautifyCopied] = useState(false);

  const copyJsonBeautify = () => {
    const jsonBeautify = json_beutify(result, null, 1, 1);
    copyTextToClipboard(jsonBeautify)
      .then(() => {
        setIsBeautifyCopied(true);
        toast.success("Copied !");
        setTimeout(() => {
          setIsBeautifyCopied(false);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't copy !");
      });
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600} title="Result">
      <Box
        sx={{
          bgcolor: darkTheme ? secondary[900] : grey[100],
          p: 2,
          overflowX: "auto",
        }}
      >
        <CopyButton
          onClick={copyJsonBeautify}
          sx={{ marginLeft: "90%" }}
          disabled={isBeautifyCopied}
        >
          {isBeautifyCopied ? "Done" : "Copy"}
        </CopyButton>
        {loading ? (
          <PartLoader />
        ) : (
          <Box className={darkTheme ? "lang-dark" : "lang-light"}>
            <JSONPretty id="json-pretty" data={result}></JSONPretty>
          </Box>
        )}
      </Box>
    </CustomModal>
  );
};

export default ResultModal;
