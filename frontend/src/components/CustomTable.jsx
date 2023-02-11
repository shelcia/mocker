import React, { useContext } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { secondary } from "../themes/themeColors";
import { grey } from "@mui/material/colors";

export const CustomJSONTable = ({ keys = [], data }) => {
  //   console.table(keys);
  const [darkTheme] = useContext(ThemeContext);

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        bgcolor: darkTheme ? secondary[900] : grey[100],
      }}
    >
      <Table
        sx={{ width: "100%" }}
        aria-label="json table"
        stickyHeader
        size="small"
      >
        <TableHead>
          {keys != [] && (
            <TableRow>
              {keys.map((key) => (
                <TableCell key={key} sx={{ fontWeight: 600 }}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keys.map((key) => (
                <TableCell
                  component="td"
                  key={key}
                  sx={{
                    width: key === "id" && 10,
                    textOverflow: key === "id" ? "ellipsis" : "inherit",
                    whiteSpace: key === "id" && "nowrap",
                    overflow: key === "id" && "hidden",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  {row?.[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
