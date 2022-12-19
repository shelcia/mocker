import React, { useContext, useEffect, useState } from "react";
import CustomModal from "../../../components/CustomModal";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeContext } from "../../../context/ThemeContext";
import SchemaOptionModal, { OptionExistFor } from "./SchemaOptionModal";
import { secondary } from "../../../themes/themeColors";
import { blueGrey } from "@mui/material/colors";
import { BiSliderAlt } from "react-icons/bi";

const CommonResourceModal = ({
  open = false,
  setOpen = () => {},
  title = "",
  inputs = {},
  setInputs = () => {},
  schema = [],
  setSchema = () => {},
  buttonTxt = "Create",
  func = () => {},
  children,
}) => {
  const [darkTheme] = useContext(ThemeContext);

  const [optionOpen, setOptionOpen] = useState(false);
  const [option, setOption] = useState({});
  const [fieldInfo, setFieldInfo] = useState({});

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    handleSchema(fieldInfo.id, fieldInfo.label, fieldInfo.field, option);
    // console.log("Im", schema);
  }, [option]);

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

  return (
    <>
      <CustomModal open={open} setOpen={setOpen} width={600}>
        <SchemaOptionModal
          optionOpen={optionOpen}
          setOptionOpen={setOptionOpen}
          fieldName={fieldInfo.field}
          setOption={setOption}
        />
        <Typography variant="h5" component="h2" color="primary" sx={{ mb: 2 }}>
          {title}
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
                      variant="contained"
                      color="primary"
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
          <Button variant="contained" size="small" onClick={func}>
            {buttonTxt}
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
        {children}
      </CustomModal>
    </>
  );
};

export default CommonResourceModal;

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
