/* eslint-disable indent */
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
import { secondary, error } from "../../../themes/themeColors";
import { blueGrey } from "@mui/material/colors";
import { BiSliderAlt } from "react-icons/bi";
import { CustomTooltip } from "../../../components/CustomTooltip";
import * as Yup from "yup";
import { ValidationError } from "../enums/error";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import IconButton from '@mui/material/IconButton';

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

  const [validationInfo, setValidationInfo] = useState(new Map());
  const [validName, setValidName] = useState(true);
  const [validNumber, setValidNumber] = useState(true);
  const [isLabelSame, setIsLabelSame] = useState(true);

  const handleInputs = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setInputs({ ...inputs, [e.target.name]: e.target.value });

    switch (name) {
      case "name":
        if (value.length === 0) {
          setValidName(false);
        } else if (!validName) {
          setValidName(true);
        }
        break;
      case "number":
        if (value.length === 0) {
          setValidNumber(false);
        } else if (Number.isInteger(value)) {
          setValidNumber(false);
        } else if (!validNumber) {
          setValidNumber(true);
        }

        break;
    }
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

  const handleAdd = (idx) => {
    let newSchema =[ ...schema ];
    newSchema.splice(idx+1, 0, { id: Date.now(), label: "", field: "" })
    setSchema(newSchema)
  }

  const ValidationSchema = Yup.object({
    field: Yup.string().required(ValidationError.FIELD_NAME),
    label: Yup.string().required(ValidationError.LABEL_NAME),
  });

  const isLabelMatch = () => {
    let _map = new Map();
    let _validationInfo = new Map();

    schema.forEach((val, idx) => {
      if (_map.has(val.label)) {
        _validationInfo.set(idx, {
          errCode: ValidationError.LABEL_NAME,
        });
        return;
      }
      _map.set(val.label, idx);
    });

    if (_validationInfo.size) {
      setValidationInfo(_validationInfo);
      setIsLabelSame(true);
      return false;
    }
    setValidationInfo(_validationInfo);
    setIsLabelSame(false);
    return true;
  };

  const ValidateForm = () => {
    setValidName(true);
    setValidNumber(true);
    setIsLabelSame(false);

    if (schema.length === 0) {
      toast.error("Atleast one resource is required");
      return false;
    }

    if (inputs.name.length === 0) {
      setValidName(false);
      return false;
    }
    if (inputs.number.length === 0 || isNaN(inputs.number)) {
      setValidNumber(false);
      return false;
    }

    let _validationInfo = new Map();

    schema.forEach((val, idx) => {
      try {
        ValidationSchema.validateSync(val);
      } catch (error) {
        _validationInfo.set(idx, {
          errCode: error.message,
        });
      }
      setValidationInfo(_validationInfo);
    });

    if (!_validationInfo.size) {
      setValidationInfo(_validationInfo);
      return true;
    }
    return false;
  };

  return (
    <>
      <CustomModal open={open} setOpen={setOpen} width={600} title={title}>
        <SchemaOptionModal
          optionOpen={optionOpen}
          setOptionOpen={setOptionOpen}
          fieldInfo={fieldInfo}
          setOption={setOption}
        />
        <Stack sx={{ mb: 2 }}>
          <TextField
            label="Resource name"
            size="small"
            fullWidth
            name="name"
            value={inputs.name}
            onChange={(e) => handleInputs(e)}
            error={!validName}
            helperText={!validName ? "Resource name is required" : ""}
          />
        </Stack>
        <Stack sx={{ mb: 2 }}>
          <TextField
            label="Number of Objects"
            size="small"
            fullWidth
            name="number"
            value={inputs.number}
            onChange={(e) => handleInputs(e)}
            error={!validNumber}
            helperText={
              !validNumber
                ? "Number of object cannot be empty and must be a number"
                : ""
            }
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField value="id" sx={{ mb: 2 }} size="small" disabled />
          <TextField value="uuid" sx={{ mb: 2 }} size="small" disabled />
        </Stack>

        {schema?.map((item, idx) => (
          <Grid container spacing={2} key={item.id}>
            <Grid item xs={3} sx={{ mb: 2 }}>
              <TextField
                sx={{ mb: 0 }}
                size="small"
                value={item.label}
                label="Label"
                onChange={(e) =>
                  handleSchema(item.id, e.target.value, item.field)
                }
              />
              {validationInfo.get(idx)?.errCode ===
                ValidationError.LABEL_NAME && (
                <Typography
                  sx={{
                    pl: 1,
                    bgcolor: error.main,
                    borderRadius: ".25rem",
                    color: "#FFFFFF",
                  }}
                >
                  {isLabelSame ? "Same label" : "Required"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={9} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} key={item.id}>
                <FormControl fullWidth>
                  <InputLabel id="resource-label">Field</InputLabel>
                  <Select
                    labelId="resource-label"
                    id="resource-id"
                    sx={{ mb: 0 }}
                    size="small"
                    label="Field"
                    value={item.field}
                    onChange={(e) => {
                      handleSchema(item.id, item.label, e.target.value);
                    }}
                  >
                    {choices.map((group) => [
                      <ListSubheader
                        key={group.category}
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
                  {validationInfo.get(idx)?.errCode ===
                    ValidationError.FIELD_NAME && (
                    <Typography
                      sx={{
                        pl: 1,
                        bgcolor: error.main,
                        borderRadius: ".25rem",
                        color: "#FFFFFF",
                      }}
                    >
                      Required
                    </Typography>
                  )}
                </FormControl>
                {OptionExistFor.includes(item.field) && (
                  <CustomTooltip
                    title={`More options for ${item?.field}`}
                    arrow
                  >
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setFieldInfo({
                            id: item.id,
                            label: item.label,
                            field: item.field,
                            option: item.option,
                          });
                          setOptionOpen(true);
                        }}
                      >
                        <Box>
                          <BiSliderAlt />
                        </Box>
                      </Button>
                    </Box>
                  </CustomTooltip>
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
                <IconButton
                  color="primary"
                  size="small"
                  sx={{ mt:10 }}
                  onClick={()=>{handleAdd(idx)}}
                >
                  <FaPlus size={"0.8rem"} />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        ))}

        <Button onClick={addSchema} variant="contained" size="small">
          Add Resource
        </Button>

        <Stack direction="row" spacing={3} mt={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (ValidateForm() && isLabelMatch()) {
                func();
              }
            }}
          >
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
    list: [
      "array",
      "bigInt",
      "boolean",
      "datetime",
      "float",
      "hexadecimal",
      "json",
      "number",
      "string",
      "uuid",
    ],
  },
  {
    category: "Commerce",
    list: ["product", "productDescription", "price", "productAdjective"],
  },
  {
    category: "Date",
    list: [
      "between",
      "betweens",
      "birthdate",
      "future",
      "month",
      "past",
      "recent",
      "soon",
      "weekday",
    ],
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
    list: ["alpha", "alphaNumeric", "locale", "numeric", "word", "words", "specialCharacter"],
  },
];
