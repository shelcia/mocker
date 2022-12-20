import React, { useContext, useState } from "react";
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { green, grey } from "@mui/material/colors";
import { ThemeContext } from "../../../context/ThemeContext";
import { secondary } from "../../../themes/themeColors";
import { CopyButton } from "../../../components/CustomButtons";
import { toast } from "react-hot-toast";
import { copyTextToClipboard } from "../../../utils/utils";
import { BACKEND_URL } from "../../../services/api";

const EndpointModal = ({ open, setOpen, result }) => {
  const [darkTheme] = useContext(ThemeContext);
  const [isCopied, setIsCopied] = useState(false);

  const points = [
    {
      method: "GET",
      endpoint: "",
    },
    {
      method: "GET",
      endpoint: "/:id",
    },
    {
      method: "POST",
      endpoint: "",
    },
    {
      method: "PUT",
      endpoint: "/:id",
    },
    {
      method: "DELETE",
      endpoint: "/:id",
    },
  ];

  // onClick handler function for the copy button
  const handleCopyClick = (data, idx) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(data)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(idx);
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
    <CustomModal open={open} setOpen={setOpen} width={600} title="Endpoints">
      <Box
        sx={{
          bgcolor: darkTheme ? secondary[900] : grey[100],
          p: 2,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableBody>
            {points.map((point, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ color: green[500], fontWeight: 900 }}>
                  {point.method}
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace" }}>
                  /{result}
                  {point.endpoint}
                </TableCell>
                <TableCell>
                  <CopyButton
                    onClick={() =>
                      handleCopyClick(
                        `${BACKEND_URL}/user/${result}${point.endpoint}`,
                        idx
                      )
                    }
                    disabled={isCopied === idx ? true : false}
                  >
                    {isCopied === idx ? "Done" : "Copy"}
                  </CopyButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </CustomModal>
  );
};

export default EndpointModal;
