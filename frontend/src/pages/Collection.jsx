import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Modal,
  Typography,
  TextField,
} from "@mui/material";

const Collection = () => {
  return (
    <React.Fragment>
      <Card>
        <TextField label="email"></TextField>
        <TextField label="password"></TextField>
      </Card>
    </React.Fragment>
  );
};

export default Collection;
