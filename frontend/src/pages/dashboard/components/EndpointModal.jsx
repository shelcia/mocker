import React, { useContext } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { green, grey } from "@mui/material/colors";
import { ThemeContext } from "../../../context/ThemeContext";

const EndpointModal = ({ open, setOpen, result }) => {
  const [darkTheme] = useContext(ThemeContext);

  const points = [
    {
      method: "GET",
      endpoint: ``,
    },
    {
      method: "GET",
      endpoint: `/:id`,
    },
    {
      method: "POST",
      endpoint: ``,
    },
    {
      method: "PUT",
      endpoint: `/:id`,
    },
    {
      method: "DELETE",
      endpoint: `/:id`,
    },
  ];

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Endpoints
      </Typography>
      <Box sx={{ bgcolor: darkTheme ? grey[900] : grey[100], p: 2 }}>
        <Table>
          <TableBody>
            {points.map((point, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ color: green[500], fontWeight: 800 }}>
                  {point.method}
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace" }}>
                  /{result}
                  {point.endpoint}
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
