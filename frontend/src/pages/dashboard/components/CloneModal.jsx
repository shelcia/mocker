import React, { useContext, useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { apiResource } from "../../../services/models/resourceModal";
import { choices } from "./ResourceModal";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BiSliderAlt } from "react-icons/bi";
import SchemaOptionModal, { OptionExistFor } from "./SchemaOptionModal";
import { blueGrey } from "@mui/material/colors";
import { secondary } from "../../../themes/themeColors";
import { ThemeContext } from "../../../context/ThemeContext";

const CloneModal = ({ open, setOpen, result, fetchResources }) => {
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

  const handleSchema = (id, label, field, option) => {
    const newArr = schema?.map((obj) => {
      if (obj.id === id) {
        option ? (obj.option = { ...option }) : null;
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

  const cloneResource = () => {
    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource
      .post(body)
      .then((res) => {
        console.log(res);
        if (res.status === "200") {
          toast.success("Cloned Successfully");
          setOpen(false);
          fetchResources();
        } else {
          setOpen(false);
          toast.error("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const [optionOpen, setOptionOpen] = useState(false);
  const [option, setOption] = useState({});
  const [fieldInfo, setFieldInfo] = useState({});

  useEffect(() => {
    handleSchema(fieldInfo.id, fieldInfo.label, fieldInfo.field, option);
  }, [option]);

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <SchemaOptionModal
        optionOpen={optionOpen}
        setOptionOpen={setOptionOpen}
        fieldName={fieldInfo.field}
        setOption={setOption}
      />
      <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
        Clone Resource
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
        <Grid container spacing={2} key={item.id}>
          <Grid item xs={3}>
            <TextField
              sx={{ mb: 2 }}
              size="small"
              value={item.label}
              label="Label"
              onChange={(e) =>
                handleSchema(item.id, e.target.value, item.field)
              }
            />
          </Grid>
          <Grid item xs={9}>
            <Stack direction="row" spacing={1} key={item.id}>
              <FormControl fullWidth>
                <InputLabel id="field-select">Field</InputLabel>
                <Select
                  labelId="field-select"
                  id="field-select"
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
                        backgroundColor: darkTheme
                          ? secondary[900]
                          : blueGrey[50],
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
              {OptionExistFor.includes(item.field) && (
                <Box>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                      setFieldInfo({
                        id: item.id,
                        label: item.label,
                        field: item.field,
                      });
                      setOptionOpen(true);
                    }}
                  >
                    <Box>
                      <BiSliderAlt />
                    </Box>
                  </Button>
                </Box>
              )}
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
          </Grid>
        </Grid>
      ))}

      <Button onClick={addSchema} variant="contained" size="small">
        Add Resource
      </Button>

      <Stack direction="row" spacing={3} mt={2}>
        <Button variant="contained" size="small" onClick={cloneResource}>
          Clone
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

export default CloneModal;
