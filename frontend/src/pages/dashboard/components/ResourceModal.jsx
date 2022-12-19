import React, { useState, useEffect, useContext } from "react";
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
import LinearProgress from "@mui/material/LinearProgress";
import CustomModal from "../../../components/CustomModal";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiResource } from "../../../services/models/resourceModal";
import { ThemeContext } from "../../../context/ThemeContext";
import { blueGrey } from "@mui/material/colors";
import { secondary } from "../../../themes/themeColors";
import { BiSliderAlt } from "react-icons/bi";
import SchemaOptionModal, { OptionExistFor } from "./SchemaOptionModal";

const ResourceModal = ({
  open,
  setOpen,
  fetchResource,
  loading,
  setLoading,
}) => {
  const { userId, projectId } = useParams();

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
    // setSchema([ ...schema, [e.target.name]: e.target.value ]);
  };

  const addSchema = () => {
    setSchema([...schema, { id: Date.now(), label: "", field: "" }]);
  };

  const deleteSchema = (id) => {
    setSchema(schema.filter((item) => item.id !== id));
  };

  const createProject = () => {
    setLoading(true);
    toast("Adding");

    const body = {
      name: inputs.name,
      number: parseInt(inputs.number),
      userId: userId,
      projectId: projectId,
      schema: schema,
    };

    apiResource.post(body).then((res) => {
      // console.log(res);
      if (res.status === "200") {
        toast.success("Added Successfully");
        fetchResource();
        setSchema([]);
        setInputs({
          name: "",
          number: 1,
          userId: userId,
          projectId: projectId,
        });
        setLoading(false);
        setOpen(false);
      } else {
        setOpen(false);
        toast.error("Error");
      }
    });
  };

  const [optionOpen, setOptionOpen] = useState(false);
  const [option, setOption] = useState({});
  const [field_info, setField_info] = useState({});

  useEffect(() => {
    handleSchema(field_info.id, field_info.label, field_info.field, option);
    console.log("Im", schema);
  }, [option]);

  const [darkTheme] = useContext(ThemeContext);

  return (
    <CustomModal open={open} setOpen={setOpen} width={600}>
      <SchemaOptionModal
        optionOpen={optionOpen}
        setOptionOpen={setOptionOpen}
        fieldName={field_info.field}
        setOption={setOption}
      />
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
                <InputLabel id="resource-label">Field</InputLabel>
                <Select
                  labelId="resource-label"
                  id="resource-id"
                  sx={{ mb: 2 }}
                  size="small"
                  label="Field"
                  value={item.field}
                  onChange={(e) => {
                    handleSchema(item.id, item.label, e.target.value);
                  }}
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
                      setField_info({
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

      {loading && (
        <Stack direction="column" spacing={3} mt={4}>
          <LinearProgress sx={{ mb: -2 }} />
          <Typography variant="p" component="p" color="primary" align="center">
            Generating Data...
          </Typography>
        </Stack>
      )}
    </CustomModal>
  );
};

export default ResourceModal;

export const choices = [
  {
    category: "Name",
    list: ["firstName", "lastName", "sex", "jobArea", "jobTitle"],
  },
  {
    category: "Image",
    list: ["avatar", "fashion", "imageUrl"],
  },
  {
    category: "Datatype",
    list: ["boolean"],
  },
  {
    category: "Commerce",
    list: ["product", "productDescription", "price", "productAdjective"],
  },
  {
    category: "Date",
    list: ["past"],
  },
  {
    category: "Lorem",
    list: ["lines", "sentences"],
  },
  {
    category: "Internet",
    list: ["domainName"],
  },
  {
    category: "Science",
    list: ["chemicalElement", "unit"],
  },
  {
    category: "Color",
    list: ["hsl", "humanColor", "rgb"],
  },
  {
    category: "Music",
    list: ["genre", "songName"],
  },
  {
    category: "Finance",
    list: [
      "amount",
      "bitcoinAddress",
      "creditCardCVV",
      "creditCardIssuer",
      "creditCardNumber",
      "currencyName",
      "currencySymbol",
      "ethereumAddress",
      "transactionDescription",
      "transactionType",
    ],
  },
  {
    category: "Random",
    list: ["alpha", "alphaNumeric", "locale", "numeric", "word", "words"],
  },
];
