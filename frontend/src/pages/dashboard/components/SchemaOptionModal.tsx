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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomModal from '../../../components/CustomModal';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);

const SchemaOptionModal = ({ optionOpen, setOptionOpen, fieldInfo, setOption }) => {
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

interface OptionProps {
  fieldInfo: any;
  myOption: any;
  setMyOption: React.Dispatch<React.SetStateAction<any>>;
}

const Option: React.FC<OptionProps> = ({ fieldInfo, myOption, setMyOption }) => {
  if (!fieldInfo) {
    return null;
  }

  switch (fieldInfo.field) {
    case 'firstName': {
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
            <MenuItem value={'male'}>Male</MenuItem>
            <MenuItem value={'female'}>Female</MenuItem>
          </Select>
        </FormControl>
      );
    }
    case 'lastName': {
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
            <MenuItem value={'male'}>MALE</MenuItem>
            <MenuItem value={'female'}>FEMALE</MenuItem>
          </Select>
        </FormControl>
      );
    }
    case 'price': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');
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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 0"
            value={myOption.min ? myOption.min : ''}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 1000"
            value={myOption.max ? myOption.max : ''}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}
        </React.Fragment>
      );
    }
    case 'past': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, years: e.target.value });
          }}
          label="past years"
          placeholder="Example: 10"
          value={myOption.years ? myOption.years : ''}
        ></TextField>
      );
    }
    case 'lines': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Line no"
          placeholder="Example: 5"
          value={myOption.count ? myOption.count : ''}
        ></TextField>
      );
    }
    case 'imageUrl': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, width: e.target.value });
            }}
            label="width"
            placeholder="Example: 480"
            value={myOption.width ? myOption.width : ''}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, height: e.target.value });
            }}
            label="height"
            placeholder="Example: 720"
            value={myOption.height ? myOption.height : ''}
          ></TextField>
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, category: e.target.value });
            }}
            label="category"
            placeholder="Example: Cat"
            value={myOption.category ? myOption.category : ''}
          ></TextField>
        </React.Fragment>
      );
    }
    case 'sentences': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, sentenceCount: e.target.value });
          }}
          label="Sentence Count"
          placeholder="Example: 5"
          value={myOption.sentenceCount ? myOption.sentenceCount : ''}
        ></TextField>
      );
    }
    case 'alpha': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of character"
          placeholder="Example: 5"
          value={myOption.count ? myOption.count : ''}
        ></TextField>
      );
    }
    case 'alphaNumeric': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of alphaNumeric character"
          placeholder="Example: 5"
          value={myOption.count ? myOption.count : ''}
        ></TextField>
      );
    }
    case 'numeric': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of digit"
          placeholder="Example: 5"
          value={myOption.count ? myOption.count : ''}
        ></TextField>
      );
    }
    case 'words': {
      return (
        <TextField
          fullWidth
          onChange={(e) => {
            setMyOption({ ...myOption, count: e.target.value });
          }}
          label="Number of word"
          placeholder="Example: 5"
          value={myOption.count ? myOption.count : ''}
        ></TextField>
      );
    }
    case 'specialCharacter': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, count: e.target.value });
            }}
            label="Number of word"
            placeholder="Example: 5"
            value={myOption.count ? myOption.count : ''}
          />
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, whitelist: e.target.value });
            }}
            label="Whitelist"
            placeholder="Example: ^&*#"
            value={myOption.whitelist ? myOption.whitelist : ''}
          />
        </React.Fragment>
      );
    }
    case 'array': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, length: e.target.value });
            }}
            label="Size of the array"
            placeholder="Example: 5"
            value={myOption.length ? myOption.length : ''}
          />
        </React.Fragment>
      );
    }

    case 'bigInt': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');

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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 0"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 1000000"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}
        </React.Fragment>
      );
    }

    case 'datetime': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');

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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 631152000000"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 4102444800000"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}
        </React.Fragment>
      );
    }

    case 'float': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');

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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="Example: 0.01"
            value={myOption.precision ? myOption.precision : ''}
          />
        </React.Fragment>
      );
    }

    case 'hexadecimal': {
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
            value={myOption.length ? myOption.length : ''}
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
              <MenuItem value={'lower'}>lower case</MenuItem>
              <MenuItem value={'upper'}>upper case</MenuItem>
              <MenuItem value={'mixed'}>mixed case</MenuItem>
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
            value={myOption.prefix ? myOption.prefix : ''}
          />
        </React.Fragment>
      );
    }

    case 'number': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');

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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="Example: 0.01"
            value={myOption.precision ? myOption.precision : ''}
          />
        </React.Fragment>
      );
    }

    case 'string': {
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
            value={myOption.length ? myOption.length : ''}
          />
        </React.Fragment>
      );
    }

    case 'between': {
      return (
        <React.Fragment>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DateTimePicker
                label="From"
                value={myOption.from ? dayjs(myOption.from).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, from: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format="YYYY-MM-DD HH:mm:ss A"
                slotProps={{ textField: { disabled: true } }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="To"
                value={myOption.to ? dayjs(myOption.to).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, to: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format="YYYY-MM-DD HH:mm:ss A"
                slotProps={{ textField: { disabled: true } }}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case 'betweens': {
      return (
        <React.Fragment>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DateTimePicker
                label="From"
                value={myOption.from ? dayjs(myOption.from).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, from: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format="YYYY-MM-DD HH:mm:ss A"
                slotProps={{ textField: { disabled: true } }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="To"
                value={myOption.to ? dayjs(myOption.to).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, to: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format="YYYY-MM-DD HH:mm:ss A"
                slotProps={{ textField: { disabled: true } }}
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
            value={myOption.num ? myOption.num : ''}
          />
        </React.Fragment>
      );
    }
    case 'birthdate': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');
      const [mode, setMode] = useState(myOption.mode ? myOption.mode : 'age');

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
            value={myOption.min ? myOption.min : ''}
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
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}

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
              <MenuItem value={'age'}>age</MenuItem>
              <MenuItem value={'year'}>year</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'future': {
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
            value={myOption.years ? myOption.years : ''}
          />
        </React.Fragment>
      );
    }
    case 'month': {
      const [abbr, setAbbr] = useState(myOption.abbr ? myOption.abbr : 'false');

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
              <MenuItem value={'false'}>long form</MenuItem>
              <MenuItem value={'true'}>abbreviation</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'recent': {
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
            value={myOption.days ? myOption.days : ''}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Reference point"
                value={myOption.refDate ? dayjs(myOption.refDate).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, refDate: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format={'YYYY-MM-DD HH:mm:ss A'}
                slotProps={{ textField: { disabled: true } }}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case 'soon': {
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
            value={myOption.days ? myOption.days : ''}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Reference point"
                value={myOption.refDate ? dayjs(myOption.refDate).utc(false) : null}
                onChange={(value) => {
                  if (!dayjs(value).isValid()) return;
                  const date_time = dayjs(value).local().toISOString();
                  setMyOption({ ...myOption, refDate: date_time });
                }}
                views={['day', 'hours', 'minutes', 'seconds']}
                format={'YYYY-MM-DD HH:mm:ss A'}
                slotProps={{ textField: { disabled: true } }}
              />
            </Box>
          </LocalizationProvider>
        </React.Fragment>
      );
    }
    case 'weekday': {
      const [abbr, setAbbr] = useState(myOption.abbr ? myOption.abbr : 'false');

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
              <MenuItem value={'false'}>long form</MenuItem>
              <MenuItem value={'true'}>abbreviation</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'cardinalDirection': {
      const [useAbbr, setUseAbbr] = useState(myOption.useAbbr ? myOption.useAbbr : 'false');
      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>useAbbr</InputLabel>
            <Select
              value={myOption.useAbbr ? myOption.useAbbr : useAbbr}
              label="useAbbr"
              onChange={(e) => {
                setUseAbbr(e.target.value);
                setMyOption({ ...myOption, useAbbr: e.target.value });
              }}
            >
              <MenuItem value={'false'}>false</MenuItem>
              <MenuItem value={'true'}>true</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'countryCode': {
      const [alphaCode, setAlphaCode] = useState(
        myOption.alphaCode ? myOption.alphaCode : 'alpha-2',
      );
      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>alphaCode</InputLabel>
            <Select
              value={myOption.alphaCode ? myOption.alphaCode : alphaCode}
              label="alphaCode"
              onChange={(e) => {
                setAlphaCode(e.target.value);
                setMyOption({ ...myOption, alphaCode: e.target.value });
              }}
            >
              <MenuItem value={'alpha-2'}>alpha-2</MenuItem>
              <MenuItem value={'alpha-3'}>alpha-3</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'direction': {
      const [useAbbr, setUseAbbr] = useState(myOption.useAbbr ? myOption.useAbbr : 'false');
      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>useAbbr</InputLabel>
            <Select
              value={myOption.useAbbr ? myOption.useAbbr : useAbbr}
              label="useAbbr"
              onChange={(e) => {
                setUseAbbr(e.target.value);
                setMyOption({ ...myOption, useAbbr: e.target.value });
              }}
            >
              <MenuItem value={'false'}>false</MenuItem>
              <MenuItem value={'true'}>true</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'latitude': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');
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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="5"
            value={myOption.precision ? myOption.precision : ''}
          />
        </React.Fragment>
      );
    }
    case 'longitude': {
      const [balance, setBalance] = useState(true);
      const [message, setMessage] = useState('');
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
                setMessage('min must be smaller than max');
              } else {
                setBalance(true);
              }
            }}
            label="min"
            placeholder="Example: 10"
            value={myOption.min ? myOption.min : ''}
          />
          <Divider sx={{ mt: 2 }} />
          <TextField
            fullWidth
            onChange={(e) => {
              let min = parseInt(myOption.min);
              let max = parseInt(e.target.value);
              setMyOption({ ...myOption, max: e.target.value });
              if (myOption.min && max < min) {
                setMessage('max must be greater than min');
                setBalance(false);
              } else {
                setBalance(true);
              }
            }}
            label="max"
            placeholder="Example: 20"
            value={myOption.max ? myOption.max : ''}
          />
          <Divider sx={{ mt: 2 }} />
          {!balance && <Chip sx={{ width: '100%' }} color={'error'} label={message} />}

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, precision: e.target.value });
            }}
            label="precision"
            placeholder="Example: 5"
            value={myOption.precision ? myOption.precision : ''}
          />
        </React.Fragment>
      );
    }
    case 'nearbyGPSCoordinate': {
      const [metric, setMetric] = useState(myOption.metric ? myOption.metric : 'KM');
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, latitude: e.target.value });
            }}
            label="latitude"
            placeholder="Example: 33"
            value={myOption.latitude ? myOption.latitude : ''}
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, longitude: e.target.value });
            }}
            label="longitude"
            placeholder="Example: 137"
            value={myOption.longitude ? myOption.longitude : ''}
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => {
              setMyOption({ ...myOption, radius: e.target.value });
            }}
            label="radius"
            placeholder="Example: 1000"
            value={myOption.radius ? myOption.radius : ''}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>metric</InputLabel>
            <Select
              value={myOption.metric ? myOption.metric : metric}
              label="metric"
              onChange={(e) => {
                setMetric(e.target.value);
                setMyOption({ ...myOption, metric: e.target.value });
              }}
            >
              <MenuItem value={'KM'}>KM</MenuItem>
              <MenuItem value={'MILE'}>MILE</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'ordinalDirection': {
      const [useAbbr, setUseAbbr] = useState(myOption.useAbbr ? myOption.useAbbr : 'false');
      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>useAbbr</InputLabel>
            <Select
              value={myOption.useAbbr ? myOption.useAbbr : useAbbr}
              label="useAbbr"
              onChange={(e) => {
                setUseAbbr(e.target.value);
                setMyOption({ ...myOption, useAbbr: e.target.value });
              }}
            >
              <MenuItem value={'false'}>false</MenuItem>
              <MenuItem value={'true'}>true</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'streetAddress': {
      const [useFullAddress, setUseFullAddress] = useState(
        myOption.useFullAddress ? myOption.useFullAddress : 'false',
      );
      return (
        <React.Fragment>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>useFullAddress</InputLabel>
            <Select
              value={myOption.useFullAddress ? myOption.useFullAddress : useFullAddress}
              label="useFullAddress"
              onChange={(e) => {
                setUseFullAddress(e.target.value);
                setMyOption({ ...myOption, useFullAddress: e.target.value });
              }}
            >
              <MenuItem value={'false'}>false</MenuItem>
              <MenuItem value={'true'}>true</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    case 'zipCode': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, format: e.target.value });
            }}
            label="format"
            placeholder="Example: #####"
            value={myOption.format ? myOption.format : ''}
          />
        </React.Fragment>
      );
    }
    case 'zipCodeByState': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, state: e.target.value });
            }}
            label="state"
            placeholder="Example: AK"
            value={myOption.state ? myOption.state : ''}
          />
        </React.Fragment>
      );
    }
    case 'commonFileName': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, ext: e.target.value });
            }}
            label="ext"
            placeholder="Example: txt"
            value={myOption.ext ? myOption.ext : ''}
          />
        </React.Fragment>
      );
    }
    case 'fileName': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, extensionCount: e.target.value });
            }}
            label="extensionCount"
            placeholder="Example: 2"
            value={myOption.extensionCount ? myOption.extensionCount : ''}
          />
        </React.Fragment>
      );
    }
    case 'networkInterface': {
      const [interfaceSchema, setInterfaceSchema] = useState(
        myOption.interfaceSchema ? myOption.interfaceSchema : 'slot',
      );
      const [interfaceType, setInterfaceType] = useState(
        myOption.interfaceType ? myOption.interfaceType : 'en',
      );
      return (
        <React.Fragment>
          <FormControl fullWidth>
            <InputLabel>interfaceSchema</InputLabel>
            <Select
              value={myOption.interfaceSchema ? myOption.interfaceSchema : interfaceSchema}
              label="interfaceSchema"
              onChange={(e) => {
                setInterfaceSchema(e.target.value);
                setMyOption({ ...myOption, interfaceSchema: e.target.value });
              }}
            >
              <MenuItem value={'slot'}>slot</MenuItem>
              <MenuItem value={'index'}>index</MenuItem>
              <MenuItem value={'mac'}>mac</MenuItem>
              <MenuItem value={'pci'}>pci</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>interfaceType</InputLabel>
            <Select
              value={myOption.interfaceType ? myOption.interfaceType : interfaceType}
              label="interfaceType"
              onChange={(e) => {
                setInterfaceType(e.target.value);
                setMyOption({ ...myOption, interfaceType: e.target.value });
              }}
            >
              <MenuItem value={'en'}>en</MenuItem>
              <MenuItem value={'wl'}>wl</MenuItem>
              <MenuItem value={'ww'}>ww</MenuItem>
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }

    case 'email': {
      return (
        <React.Fragment>
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, firstName: e.target.value });
            }}
            label="first Name"
            placeholder="Example: Jeanne"
            value={myOption.firstName ? myOption.firstName : ''}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, lastName: e.target.value });
            }}
            label="last Name"
            placeholder="Example: Doe"
            value={myOption.lastName ? myOption.lastName : ''}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            onChange={(e) => {
              setMyOption({ ...myOption, provider: e.target.value });
            }}
            label="provider"
            placeholder="Example: example.fakerjs.dev"
            value={myOption.provider ? myOption.provider : ''}
            size="small"
          />
        </React.Fragment>
      );
    }

    case 'default':
      return null;
  }
};

export default SchemaOptionModal;
