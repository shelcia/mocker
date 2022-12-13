import React, { useEffect, useState } from "react";
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
  ListSubheader,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { apiResource } from "../../../services/models/resourceModal";
import { choices } from "./ResourceModal";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { blueGrey } from "@mui/material/colors";
import { secondary } from "../../../themes/themeColors";

const EditResourceModal = ({ open, setOpen, result, fetchResult }) => {
  const { userId, projectId } = useParams();

  const [darkTheme] = useContext(ThemeContext);

  const [inputs, setInputs] = useState({
    name: "",
    number: 1,
    userId: userId,
    projectId: projectId,
  });

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [schema, setSchema] = useState([]);

  const handleSchema = (id, label, field) => {
    const newArr = schema?.map((obj) => {
      if (obj.id === id) {
        return { ...obj, label: label, field: field };
      }
      return obj;
    });
    setSchema(newArr);
  };

  const addSchema = () => {
    setSchema([...schema, { id: Date.now(), label: "", field: "" }]);
  };

  const deleteSchema = (id) => {
    setSchema(schema.filter((item) => item.id !== id));
  };

  const fetchResource = (signal) => {
    apiResource.getSingle(result, signal).then((res) => {
      // console.log(res.data);
      if (res.status === "200") {
        setInputs({
          name: res.message?.name,
          number: res.message?.number,
          userId: userId,
          projectId: projectId,
          id: res.message._id,
        });
        setSchema(res.message?.schema);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
  }, []);

  const updateResource = () => {
    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource.putById(result, body).then((res) => {
      if (res.status === "200") {
        toast.success("Edited Successfully");
        setOpen(false);
        // fetchResource();
        fetchResult();
      } else {
        toast.error("Error");
        setOpen(false);
      }
    });
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Update Resource
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
              {choices?.map((group) => [
                <ListSubheader
                  sx={{
                    color: darkTheme ? "#fff" : "#1d2438",
                    fontWeight: 600,
                    backgroundColor: darkTheme ? secondary[900] : blueGrey[50],
                  }}
                >
                  {group.category}
                </ListSubheader>,
                group.list?.map((choice) => (
                  <MenuItem value={choice} key={choice}>
                    {choice}
                  </MenuItem>
                )),
              ])}
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
        <Button variant="contained" size="small" onClick={updateResource}>
          Update
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
    </CustomModal>
  );
};

export default EditResourceModal;
