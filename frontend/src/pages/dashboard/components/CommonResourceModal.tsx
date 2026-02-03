import React, { useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import CustomModal from '../../../components/CustomModal';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import { ThemeContext } from '../../../context/ThemeContext';
import SchemaOptionModal from './SchemaOptionModal';
import { CHOICES, OPTION_EXIST_FOR, VALIDATION_ERROR } from '../../../data/constants';
import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        field: Yup.string().required(VALIDATION_ERROR.FIELD_NAME),
        label: Yup.string().required(VALIDATION_ERROR.LABEL_NAME),
      }),
    [],
  );

  const isLabelMatch = (): boolean => {
    const labelMap = new Map<string, number>();
    const errs = new Map<number, ValidationMapValue>();

    schema.forEach((val, idx) => {
      if (labelMap.has(val.label)) {
        errs.set(idx, { errCode: VALIDATION_ERROR.LABEL_NAME });
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

      {/* Resource name */}
      <div className="space-y-2">
        <Label htmlFor="resource-name">Resource name</Label>
        <Input
          id="resource-name"
          name="name"
          value={inputs.name}
          onChange={handleInputs}
          aria-invalid={!validName}
        />
        {!validName ? <p className="text-sm text-destructive">Resource name is required</p> : null}
      </div>

      {/* Number of objects */}
      <div className="mt-4 space-y-2">
        <Label htmlFor="resource-number">Number of Objects</Label>
        <Input
          id="resource-number"
          name="number"
          inputMode="numeric"
          value={Number.isNaN(inputs.number) ? '' : String(inputs.number)}
          onChange={handleInputs}
          aria-invalid={!validNumber}
        />
        {!validNumber ? (
          <p className="text-sm text-destructive">
            Number of object cannot be empty and must be a number
          </p>
        ) : null}
      </div>

      {/* Reserved fields */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>id</Label>
          <Input value="id" disabled />
        </div>
        <div className="space-y-2">
          <Label>uuid</Label>
          <Input value="uuid" disabled />
        </div>
      </div>

      <div className="space-y-3">
        {schema.map((item, idx) => {
          const labelErr = validationInfo.get(idx)?.errCode === VALIDATION_ERROR.LABEL_NAME;
          const fieldErr = validationInfo.get(idx)?.errCode === VALIDATION_ERROR.FIELD_NAME;

          return (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
              {/* Label column (xs=3) */}
              <div className="col-span-12 sm:col-span-3 space-y-2">
                <Label htmlFor={`schema-label-${item.id}`}>Label</Label>
                <Input
                  id={`schema-label-${item.id}`}
                  value={item.label}
                  onChange={(e) => updateSchemaItem(item.id, { label: e.target.value })}
                  aria-invalid={labelErr}
                />

                {labelErr ? (
                  <p className="text-xs text-destructive">
                    {isLabelSame ? 'Same label' : 'Required'}
                  </p>
                ) : null}
              </div>

              {/* Field + actions column (xs=9) */}
              <div className="col-span-12 sm:col-span-9">
                <div className="flex flex-wrap gap-2 items-start">
                  {/* Field select */}
                  <div className="flex-1 min-w-[220px] space-y-2">
                    <Label htmlFor={`schema-field-${item.id}`}>Field</Label>

                    {/* shadcn Select is controlled via value + onValueChange */}
                    <Select
                      value={item.field ?? ''}
                      onValueChange={(val) => updateSchemaItem(item.id, { field: val })}
                    >
                      <SelectTrigger id={`schema-field-${item.id}`} aria-invalid={fieldErr}>
                        <SelectValue placeholder="Select a field" />
                      </SelectTrigger>

                      <SelectContent>
                        {CHOICES.map((group) => (
                          <SelectGroup key={group.category}>
                            <SelectLabel className="text-muted-foreground">
                              {group.category}
                            </SelectLabel>
                            {group.list.map((choice) => (
                              <SelectItem key={`${group.category}-${choice}`} value={choice}>
                                {choice}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldErr ? <p className="text-xs text-destructive">Required</p> : null}
                  </div>

                  {/* Options button */}
                  {OPTION_EXIST_FOR.includes(item.field) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="mt-7"
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
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More options for {item.field}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="destructive"
                    className="mt-7"
                    onClick={() => deleteSchema(item.id)}
                  >
                    Delete
                  </Button>

                  {/* Add row (+) */}
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="mt-7"
                    onClick={() => handleAdd(idx)}
                    aria-label="Add schema row"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {/* Add Resource */}
        <Button size="sm" onClick={addSchema} className="w-fit">
          Add Resource
        </Button>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            size="sm"
            onClick={() => {
              if (validateForm() && isLabelMatch()) {
                void func();
              }
            }}
          >
            {buttonTxt}
          </Button>

          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>

      {children}
    </CustomModal>
  );
};

export default CommonResourceModal;
