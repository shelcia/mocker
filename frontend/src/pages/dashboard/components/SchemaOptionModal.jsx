/* eslint-disable indent */
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CustomModal from "../../../components/CustomModal";

const SchemaOptionModal = ({
  optionOpen,
  setOptionOpen,
  fieldName,
  setOption,
}) => {
  const [myOption, setMyOption] = useState({});

  return (
    <CustomModal open={optionOpen} setOpen={setOptionOpen} width={500}>
      <Container>
        <Option
          fieldName={fieldName}
          myOption={myOption}
          setMyOption={setMyOption}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setOptionOpen(false);
              setOption({ ...myOption });
              setMyOption({});
            }}
          >
            Done !
          </Button>
        </Box>
      </Container>
    </CustomModal>
  );
};

export const Option = ({ fieldName, myOption, setMyOption }) => {
  switch (fieldName) {
    case "firstName": {
      const [sex, setSex] = useState(myOption.sex);
      return (
        <FormControl fullWidth>
          <InputLabel>sex</InputLabel>
          <Select
            value={sex}
            label="sex"
            onChange={(e) => {
              setSex(e.target.value);
              setMyOption({ ...myOption, sex: e.target.value });
            }}
          >
            <MenuItem value={0}>Random</MenuItem>
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
          </Select>
        </FormControl>
      );
    }
    case "lastName": {
      const [sex, setSex] = useState("");
      return (
        <FormControl fullWidth>
          <InputLabel>sex</InputLabel>
          <Select
            value={sex}
            label="sex"
            onChange={(e) => {
              setSex(e.target.value);
              setMyOption({ ...myOption, sex: e.target.value });
            }}
          >
            <MenuItem value={0}>Random</MenuItem>
            <MenuItem value={"male"}>MALE</MenuItem>
            <MenuItem value={"female"}>FEMALE</MenuItem>
          </Select>
        </FormControl>
      );
    }
    case "price": {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState("");
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(e.target.value);
              let max = parseInt(myOption.max);
              setMyOption({ ...myOption, min: e.target.value });
              if (myOption.max && max < min) {
                setBalance(false);
                setMessage("min must be smaller than max");
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 0"
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage("max must be greater than min");
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 1000"
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}
        </React.Fragment>
      );
    }
    case "past": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, years: e.target.value });
          }}
          label="past years"
          placeholder="Example: 10"
        ></TextField>
      );
    }
    case "lines": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Line no"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "imageUrl": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, width: e.target.value });
            }}
            label="width"
            placeholder="Example: 480"
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, height: e.target.value });
            }}
            label="height"
            placeholder="Example: 720"
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, category: e.target.value });
            }}
            label="category"
            placeholder="Example: Cat"
          ></TextField>
        </React.Fragment>
      );
    }
    case "sentences": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, sentenceCount: e.target.value });
          }}
          label="Sentence Count"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "alpha": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of character"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "alphaNumeric": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of alphaNumeric character"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "numeric": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of digit"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "words": {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of word"
          placeholder="Example: 5"
        ></TextField>
      );
    }
    case "default":
      return () => {};
  }
};

export const OptionExistFor = [
  "firstName",
  "lastName",
  "price",
  "past",
  "lines",
  "imageUrl",
  "sentences",
  "alpha",
  "alphaNumeric",
  "numeric",
  "words",
  "default",
];

export default SchemaOptionModal;
