import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import CustomModal from "../../../components/CustomModal";

const ResourceModal = ({
  open,
  setOpen,
  inputs,
  handleInputs,
  schema,
  handleSchema,
  addSchema,
  deleteSchema,
  createProject,
  loading
}) => {

  console.log(loading);

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        New Resource
      </Typography>
      <TextField
        label="Resource name"
        sx={{ mb: 2 }}
        size="small"
        fullWidth
        name="name"
        value={inputs.name}
        onChange={(e) => handleInputs(e)}
      />
      <TextField
        label="Number of Objects"
        sx={{ mb: 2 }}
        size="small"
        fullWidth
        name="number"
        value={inputs.number}
        onChange={(e) => handleInputs(e)}
      />

      <Stack direction="row" spacing={1}>
        <TextField value="id" sx={{ mb: 2 }} size="small" disabled />
        <TextField value="uuid" sx={{ mb: 2 }} size="small" disabled />
      </Stack>

      {schema?.map((item, idx) => (
        <Stack direction="row" spacing={1} key={item.id}>
          <TextField
            sx={{ mb: 2 }}
            size="small"
            value={item.label}
            label="Label"
            onChange={(e) => handleSchema(item.id, e.target.value, item.field)}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Field</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              sx={{ mb: 2 }}
              size="small"
              label="Field"
              value={item.field}
              onChange={(e) =>
                handleSchema(item.id, item.label, e.target.value)
              }
            >
              {choices?.map((choice) => (
                <MenuItem value={choice} key={choice}>
                  {choice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteSchema(item.id)}
            >
              Delete
            </Button>
          </Box>
        </Stack>
      ))}

      <Button onClick={addSchema} variant="contained" size="small">
        Add Resource
      </Button>

      <Stack direction="row" spacing={3} mt={2}>
        <Button variant="contained" size="small" onClick={createProject}>
          Create
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </Stack>

      {loading &&
        <Stack direction="column" spacing={3} mt={4}>
          <LinearProgress sx={{ mb: -2 }} />
          <Typography variant="p" component="p" color="primary" align="center">
            Creating JSON ...
          </Typography>
        </Stack>
      }

    </CustomModal>
  );
};

export default ResourceModal;

export const choices = [
  "firstName",
  "lastName",
  "sex",
  "jobArea",
  "jobTitle",
  "avatar",
  "fashion",
  "product",
  "productDescription",
  "price",
  "productAdjective",
  "boolean",
  "past",
  "lines",
  "domainName",
  "imageUrl",
  "sentences",
  "chemicalElement",
  "unit",
  "hsl",
  "humanColor",
  "rgb",
  "genre",
  "songName",
  "amount",
  "bitcoinAddress",
  "creditCardCVV",
  "creditCardIssuer",
  "creditCardNumber",
  "currencyName",
  "currencySymbol",
  "ethereumAddress",
  "transactionDescription",
  "transactionType"
];
