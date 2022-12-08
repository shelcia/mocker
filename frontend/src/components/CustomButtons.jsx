import { Button, styled } from "@mui/material";
import { blue, green } from "@mui/material/colors";

export const CopyButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: "1px 5px",
  fontSize: "0.8rem",
  background: theme.palette.mode === "dark" ? blue[500] : blue[400],
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? blue[900] : blue[500],
  },
  "&:disabled": {
    backgroundColor: theme.palette.mode === "dark" ? green[800] : green[500],
    color: green[50],
  },
}));
