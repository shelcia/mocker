import { Button, styled } from "@mui/material";
import { blue, green } from "@mui/material/colors";

export const CopyButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: "1px 5px",
  fontSize: "0.8rem",
  background: blue[500],
  color: "white",
  "&:hover": {
    backgroundColor: blue[900],
  },
  "&:disabled": {
    backgroundColor: green[900],
    color: green[50],
  },
}));
