import React, { useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import CustomModal from '../../../components/CustomModal';
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
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { blueGrey } from '@mui/material/colors';
import { BiSliderAlt } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import { ThemeContext } from '../../../context/ThemeContext';
import SchemaOptionModal from './SchemaOptionModal';
import { secondary, error } from '../../../themes/themeColors';
import { CustomTooltip } from '../../../components/CustomTooltip';
import { ValidationError } from '../enums/error';
import { CHOICES, OPTION_EXIST_FOR } from '../../../data/constants';

export type SchemaField = string;

export type SchemaOption = Record<string, unknown>;

export type SchemaItem = {
  id: number;
  label: string;
  field: SchemaField;
  option?: SchemaOption;
};

export type InputsState = {
  name: string;
  number: number; // keep as number
  userId?: string;
  projectId?: string;
  id?: string;
};

type ValidationMapValue = { errCode: string };

interface CommonResourceModalProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;

  inputs: InputsState;
  setInputs: React.Dispatch<React.SetStateAction<InputsState>>;

  schema: SchemaItem[];
  setSchema: React.Dispatch<React.SetStateAction<SchemaItem[]>>;

  buttonTxt?: string;
  func: () => void | Promise<void>;
  children?: ReactNode;
}

const CommonResourceModal = ({
  open = false,
  setOpen = () => {},
  title = '',
  inputs,
  setInputs,
  schema,
  setSchema,
  buttonTxt = 'Create',
  func,
  children,
}: CommonResourceModalProps) => {
  const [darkTheme] = useContext(ThemeContext);

  const [optionOpen, setOptionOpen] = useState<boolean>(false);
  const [option, setOption] = useState<SchemaOption>({});
  const [fieldInfo, setFieldInfo] = useState<{
    id?: number;
    label?: string;
    field?: string;
    option?: SchemaOption;
  }>({});

  const [validationInfo, setValidationInfo] = useState<Map<number, ValidationMapValue>>(
    () => new Map(),
  );
  const [validName, setValidName] = useState<boolean>(true);
  const [validNumber, setValidNumber] = useState<boolean>(true);
  const [isLabelSame, setIsLabelSame] = useState<boolean>(false);

  // -----------------------
  // Input handling
  // -----------------------
  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'number') {
      const num = Number(value);
      setInputs((prev) => ({ ...prev, number: num }));

      if (!value.length || Number.isNaN(num)) {
        setValidNumber(false);
      } else if (!validNumber) {
        setValidNumber(true);
      }
      return;
    }

    setInputs((prev) => ({ ...prev, [name]: value }) as InputsState);

    if (name === 'name') {
      if (value.length === 0) setValidName(false);
      else if (!validName) setValidName(true);
    }
  };

  // -----------------------
  // Schema updates
  // -----------------------
  const updateSchemaItem = (id: number, patch: Partial<SchemaItem>) => {
    setSchema((prev) => prev.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)));
  };

  useEffect(() => {
    if (!fieldInfo.id) return;
    // When SchemaOptionModal updates `option`, apply it to the selected schema row
    updateSchemaItem(fieldInfo.id, { option: { ...option } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option]);

  const addSchema = () => {
    setSchema((prev) => [...prev, { id: Date.now(), label: '', field: '' }]);
  };

  const deleteSchema = (id: number) => {
    setSchema((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (idx: number) => {
    setSchema((prev) => {
      const next = [...prev];
      next.splice(idx + 1, 0, { id: Date.now(), label: '', field: '' });
      return next;
    });
  };

  // -----------------------
  // Validation
  // -----------------------
  const ValidationSchema = useMemo(
    () =>
      Yup.object({
        field: Yup.string().required(ValidationError.FIELD_NAME),
        label: Yup.string().required(ValidationError.LABEL_NAME),
      }),
    [],
  );

  const isLabelMatch = (): boolean => {
    const labelMap = new Map<string, number>();
    const errs = new Map<number, ValidationMapValue>();

    schema.forEach((val, idx) => {
      if (labelMap.has(val.label)) {
        errs.set(idx, { errCode: ValidationError.LABEL_NAME });
        return;
      }
      labelMap.set(val.label, idx);
    });

    setValidationInfo(errs);
    if (errs.size) {
      setIsLabelSame(true);
      return false;
    }

    setIsLabelSame(false);
    return true;
  };

  const validateForm = (): boolean => {
    setValidName(true);
    setValidNumber(true);
    setIsLabelSame(false);

    if (schema.length === 0) {
      toast.error('Atleast one resource is required');
      return false;
    }

    if (!inputs.name || inputs.name.length === 0) {
      setValidName(false);
      return false;
    }

    if (Number.isNaN(inputs.number) || inputs.number <= 0) {
      setValidNumber(false);
      return false;
    }

    const errs = new Map<number, ValidationMapValue>();

    schema.forEach((val, idx) => {
      try {
        ValidationSchema.validateSync(val);
      } catch (e) {
        const yupErr = e as Yup.ValidationError;
        errs.set(idx, { errCode: yupErr.message });
      }
    });

    setValidationInfo(errs);
    return errs.size === 0;
  };

  // -----------------------
  // Render
  // -----------------------
  return (
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
          onChange={handleInputs}
          error={!validName}
          helperText={!validName ? 'Resource name is required' : ''}
        />
      </Stack>

      <Stack sx={{ mb: 2 }}>
        <TextField
          label="Number of Objects"
          size="small"
          fullWidth
          name="number"
          value={Number.isNaN(inputs.number) ? '' : inputs.number}
          onChange={handleInputs}
          error={!validNumber}
          helperText={!validNumber ? 'Number of object cannot be empty and must be a number' : ''}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField value="id" size="small" disabled />
        <TextField value="uuid" size="small" disabled />
      </Stack>

      {schema.map((item, idx) => (
        <Grid container spacing={2} key={item.id}>
          <Grid size={{ xs: 3 }} sx={{ mb: 2 }}>
            <TextField
              size="small"
              value={item.label}
              label="Label"
              onChange={(e) => updateSchemaItem(item.id, { label: e.target.value })}
            />

            {validationInfo.get(idx)?.errCode === ValidationError.LABEL_NAME && (
              <Typography
                sx={{
                  pl: 1,
                  bgcolor: error.main,
                  borderRadius: '.25rem',
                  color: '#FFFFFF',
                }}
              >
                {isLabelSame ? 'Same label' : 'Required'}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 9 }} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <InputLabel id={`resource-label-${item.id}`}>Field</InputLabel>
                <Select
                  labelId={`resource-label-${item.id}`}
                  id={`resource-id-${item.id}`}
                  size="small"
                  label="Field"
                  name="field"
                  value={item.field ?? ''}
                  onChange={(e) => updateSchemaItem(item.id, { field: e.target.value as string })}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {CHOICES.flatMap((group) => [
                    <ListSubheader
                      key={`${group.category}-header`}
                      disableSticky
                      sx={{
                        color: darkTheme ? '#fff' : '#1d2438',
                        fontWeight: 600,
                        backgroundColor: darkTheme ? secondary[900] : blueGrey[50],
                        pointerEvents: 'none',
                      }}
                    >
                      {group.category}
                    </ListSubheader>,
                    ...group.list.map((choice) => (
                      <MenuItem value={choice} key={`${group.category}-${choice}`}>
                        {choice}
                      </MenuItem>
                    )),
                  ])}
                </Select>

                {validationInfo.get(idx)?.errCode === ValidationError.FIELD_NAME && (
                  <Typography
                    sx={{
                      pl: 1,
                      bgcolor: error.main,
                      borderRadius: '.25rem',
                      color: '#FFFFFF',
                    }}
                  >
                    Required
                  </Typography>
                )}
              </FormControl>

              {OPTION_EXIST_FOR.includes(item.field) && (
                <CustomTooltip title={`More options for ${item.field}`} arrow>
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
                      <BiSliderAlt />
                    </Button>
                  </Box>
                </CustomTooltip>
              )}

              <Box>
                <Button variant="contained" color="error" onClick={() => deleteSchema(item.id)}>
                  Delete
                </Button>
              </Box>

              <IconButton
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleAdd(idx)}
              >
                <FaPlus size="0.8rem" />
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
            if (validateForm() && isLabelMatch()) {
              void func();
            }
          }}
        >
          {buttonTxt}
        </Button>

        <Button variant="contained" color="secondary" size="small" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Stack>

      {children}
    </CustomModal>
  );
};

export default CommonResourceModal;
