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
import React, { useEffect, useState } from "react";
import CustomModal from "../../../components/CustomModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);

const SchemaOptionModal = ({
  optionOpen,
  setOptionOpen,
  fieldInfo,
  setOption,
}) => {
  const [myOption, setMyOption] = useState({});

  useEffect(() => {
    setMyOption(fieldInfo.option ? fieldInfo.option : {});
  }, [fieldInfo]);

  return (
    <CustomModal open={optionOpen} setOpen={setOptionOpen} width={500}>
      <Container>
        <Option
          // fieldName={fieldName}
          fieldInfo={fieldInfo}
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

export const Option = ({ fieldInfo, myOption, setMyOption }) => {
  switch (fieldInfo.field) {
    case "firstName": {
      const [sex, setSex] = useState(myOption.sex ? myOption.sex : 0);
      return (
        <FormControl fullWidth>
          <InputLabel>sex</InputLabel>
          <Select
            value={myOption.sex ? myOption.sex : sex}
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
      const [sex, setSex] = useState(myOption.sex ? myOption.sex : 0);
      return (
        <FormControl fullWidth>
          <InputLabel>sex</InputLabel>
          <Select
            value={myOption.sex ? myOption.sex : sex}
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
            value={myOption.min ? myOption.min : ""}
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
            value={myOption.max ? myOption.max : ""}
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
          value={myOption.years ? myOption.years : ""}
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
          value={myOption.count ? myOption.count : ""}
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
            value={myOption.width ? myOption.width : ""}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, height: e.target.value });
            }}
            label="height"
            placeholder="Example: 720"
            value={myOption.height ? myOption.height : ""}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, category: e.target.value });
            }}
            label="category"
            placeholder="Example: Cat"
            value={myOption.category ? myOption.category : ""}
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
          value={myOption.sentenceCount ? myOption.sentenceCount : ""}
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
          value={myOption.count ? myOption.count : ""}
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
          value={myOption.count ? myOption.count : ""}
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
          value={myOption.count ? myOption.count : ""}
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
          value={myOption.count ? myOption.count : ""}
        ></TextField>
      );
    }
    case "array": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, length: e.target.value });
            }}
            label="Size of the array"
            placeholder="Example: 5"
            value={myOption.length ? myOption.length : ""}
          />
        </React.Fragment>
      );
    }

    case "bigInt": {
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
            value={myOption.min ? myOption.min : ""}
          />
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
            placeholder="Example: 1000000"
            value={myOption.max ? myOption.max : ""}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}
        </React.Fragment>
      );
    }

    case "datetime": {
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
            placeholder="Example: 631152000000"
            value={myOption.min ? myOption.min : ""}
          />
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
            placeholder="Example: 4102444800000"
            value={myOption.max ? myOption.max : ""}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}
        </React.Fragment>
      );
    }

    case "float": {
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
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ""}
          />
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
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ""}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="Example: 0.01"
            value={myOption.precision ? myOption.precision : ""}
          />
        </React.Fragment>
      );
    }

    case "hexadecimal": {
      const [_case, setCase] = useState(myOption.case ? myOption.case : 0);

      return (
        <React.Fragment>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, length: e.target.value });
            }}
            label="length"
            placeholder="Example: 10"
            value={myOption.length ? myOption.length : ""}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>case</InputLabel>
            <Select
              value={myOption.case ? myOption.case : _case}
              label="case"
              onChange={(e) => {
                setCase(e.target.value);
                setMyOption({ ...myOption, case: e.target.value });
              }}
            >
              <MenuItem value={"lower"}>lower case</MenuItem>
              <MenuItem value={"upper"}>upper case</MenuItem>
              <MenuItem value={"mixed"}>mixed case</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, prefix: e.target.value });
            }}
            label="prefix"
            placeholder="Example: 0X"
            value={myOption.prefix ? myOption.prefix : ""}
          />
        </React.Fragment>
      );
    }

    case "number": {
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
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ""}
          />
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
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ""}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="Example: 0.01"
            value={myOption.precision ? myOption.precision : ""}
          />
        </React.Fragment>
      );
    }

    case "string": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, length: e.target.value });
            }}
            label="length"
            placeholder="Example: 10"
            value={myOption.length ? myOption.length : ""}
          />
        </React.Fragment>
      );
    }

    case "between": {
      return (
        <React.Fragment>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DateTimePicker
                label="From"
                value={
                  myOption.from ? dayjs(myOption.from).utc(false) : Date.now()
                }
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, from: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="To"
                value={myOption.to ? dayjs(myOption.to).utc(false) : Date.now()}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, to: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField disabled {...params} />}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case "betweens": {
      return (
        <React.Fragment>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DateTimePicker
                label="From"
                value={
                  myOption.from ? dayjs(myOption.from).utc(false) : Date.now()
                }
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, from: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="To"
                value={myOption.to ? dayjs(myOption.to).utc(false) : Date.now()}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, to: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField disabled {...params} />}
              />
            </Box>
          </LocalizationProvider>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, num: e.target.value });
            }}
            label="Number of dates"
            placeholder="Example: 10"
            value={myOption.num ? myOption.num : ""}
          />
        </React.Fragment>
      );
    }
    case "birthdate": {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState("");
      const [mode, setMode] = useState(myOption.mode ? myOption.mode : "age");

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
                setMessage(`minimum ${mode} must be smaller than max`);
              } else {
                setBalance(true);
              }
            }}
            label={`minimum ${mode}`}
            placeholder="Example: 18"
            value={myOption.min ? myOption.min : ""}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage(`maximum ${mode} must be greater than min`);
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label={`maximum ${mode}`}
            placeholder="Example: 60"
            value={myOption.max ? myOption.max : ""}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && (
            <Chip sx={{ width: "100%" }} color={"error"} label={message} />
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>mode</InputLabel>
            <Select
              value={myOption.mode ? myOption.mode : mode}
              label="mode"
              onChange={(e) => {
                setMode(e.target.value);
                setMyOption({ ...myOption, mode: e.target.value });
              }}
            >
              <MenuItem value={"age"}>age</MenuItem>
              <MenuItem value={"year"}>year</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case "future": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, years: e.target.value });
            }}
            label="years"
            placeholder="Example: 10"
            value={myOption.years ? myOption.years : ""}
          />
        </React.Fragment>
      );
    }
    case "month": {
      const [abbr, setAbbr] = useState(myOption.abbr ? myOption.abbr : "false");

      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>abbr</InputLabel>
            <Select
              value={myOption.abbr ? myOption.abbr : abbr}
              label="abbr"
              onChange={(e) => {
                setAbbr(e.target.value);
                setMyOption({ ...myOption, abbr: e.target.value });
              }}
            >
              <MenuItem value={"false"}>long form</MenuItem>
              <MenuItem value={"true"}>abbreviation</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case "recent": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, days: e.target.value });
            }}
            label="days"
            placeholder="Example: 10"
            value={myOption.days ? myOption.days : ""}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Reference point"
                value={
                  myOption.refDate
                    ? dayjs(myOption.refDate).utc(false)
                    : Date.now()
                }
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, refDate: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case "soon": {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, days: e.target.value });
            }}
            label="days"
            placeholder="Example: 10"
            value={myOption.days ? myOption.days : ""}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Reference point"
                value={
                  myOption.refDate
                    ? dayjs(myOption.refDate).utc(false)
                    : Date.now()
                }
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, refDate: date_time });
                }}
                views={["day", "hours", "minutes", "seconds"]}
                inputFormat={"YYYY-MM-DD HH:mm:ss A"}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case "weekday": {
      const [abbr, setAbbr] = useState(myOption.abbr ? myOption.abbr : "false");

      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>abbr</InputLabel>
            <Select
              value={myOption.abbr ? myOption.abbr : abbr}
              label="abbr"
              onChange={(e) => {
                setAbbr(e.target.value);
                setMyOption({ ...myOption, abbr: e.target.value });
              }}
            >
              <MenuItem value={"false"}>long form</MenuItem>
              <MenuItem value={"true"}>abbreviation</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
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
  "array",
  "bigInt",
  "datetime",
  "float",
  "hexadecimal",
  "number",
  "string",
  "between",
  "betweens",
  "birthdate",
  "future",
  "month",
  "recent",
  "soon",
  "weekday",
];

export default SchemaOptionModal;
