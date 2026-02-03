import React, { useEffect, useState } from 'react';
import CustomModal from '../../../components/CustomModal';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fromISO, toISO } from '@/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const SchemaOptionModal = ({ optionOpen, setOptionOpen, fieldInfo, setOption }) => {
  const [myOption, setMyOption] = useState({});

  useEffect(() => {
    setMyOption(fieldInfo.option ? fieldInfo.option : {});
  }, [fieldInfo]);

  return (
    <CustomModal open={optionOpen} setOpen={setOptionOpen} width={500}>
      <div className="space-y-4">
        <Option fieldInfo={fieldInfo} myOption={myOption} setMyOption={setMyOption} />

        <div className="pt-2">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              setOptionOpen(false);
              setOption({ ...myOption });
              setMyOption({});
            }}
          >
            Done!
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

interface OptionProps {
  fieldInfo: any;
  myOption: any;
  setMyOption: React.Dispatch<React.SetStateAction<any>>;
}

type OptionRendererProps = {
  myOption: any;
  setMyOption: React.Dispatch<React.SetStateAction<any>>;
};

export const Option: React.FC<OptionProps> = ({ fieldInfo, myOption, setMyOption }) => {
  if (!fieldInfo?.field) return null;

  const Component = OPTION_RENDERERS[fieldInfo.field] ?? null;
  if (!Component) return null;

  return (
    <div className="space-y-4">
      <Component myOption={myOption} setMyOption={setMyOption} />
    </div>
  );
};

/* -----------------------------
   Shared helpers 
------------------------------ */

function Field({
  label,
  value,
  placeholder,
  onChange,
  inputMode,
  className,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  className?: string;
}) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function useMinMaxValidator() {
  const [message, setMessage] = React.useState('');

  const validate = React.useCallback((minStr?: string, maxStr?: string, custom?: string) => {
    if (custom) {
      setMessage(custom);
      return false;
    }

    if (!minStr || !maxStr) {
      setMessage('');
      return true;
    }

    const min = Number(minStr);
    const max = Number(maxStr);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      setMessage('min and max must be numbers');
      return false;
    }

    if (max < min) {
      setMessage('max must be greater than min');
      return false;
    }

    setMessage('');
    return true;
  }, []);

  return { message, validate };
}

function MinMax({
  myOption,
  setMyOption,
  minLabel = 'min',
  maxLabel = 'max',
  minPlaceholder,
  maxPlaceholder,
  validateLabelMessage,
}: OptionRendererProps & {
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  // used by birthdate where message depends on mode
  validateLabelMessage?: (mode: string) => { minMsg: string; maxMsg: string };
}) {
  const { message, validate } = useMinMaxValidator();

  const min = myOption.min ?? '';
  const max = myOption.max ?? '';

  // birthdate needs mode-based text; others keep default
  const mode = myOption.mode ?? 'age';
  const labels = validateLabelMessage?.(mode);

  return (
    <div className="space-y-4">
      <Field
        label={labels?.minMsg ?? minLabel}
        value={String(min)}
        placeholder={minPlaceholder}
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, min: val }));
          // validate against current max
          const ok = validate(val, String(myOption.max ?? ''));
          // if birthdate mode: override message when invalid
          if (!ok && validateLabelMessage) {
            // keep generic min/max ordering error text
          }
        }}
      />

      <Separator />

      <Field
        label={labels?.maxMsg ?? maxLabel}
        value={String(max)}
        placeholder={maxPlaceholder}
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, max: val }));
          validate(String(myOption.min ?? ''), val);
        }}
      />

      <ErrorBanner message={message} />
    </div>
  );
}

function SimpleCount({ myOption, setMyOption, label }: OptionRendererProps & { label: string }) {
  return (
    <Field
      label={label}
      value={String(myOption.count ?? '')}
      placeholder="Example: 5"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, count: val }))}
    />
  );
}

function BooleanSelect({
  myOption,
  setMyOption,
  field,
  label,
  trueLabel = 'true',
  falseLabel = 'false',
}: OptionRendererProps & {
  field: string;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
}) {
  const value = (myOption?.[field] ?? 'false').toString();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(val) => setMyOption((prev: any) => ({ ...prev, [field]: val }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="false">{falseLabel}</SelectItem>
          <SelectItem value="true">{trueLabel}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function EnumSelect({
  myOption,
  setMyOption,
  field,
  label,
  items,
}: OptionRendererProps & {
  field: string;
  label: string;
  items: Array<{ value: string; label: string }>;
}) {
  const value = (myOption?.[field] ?? items[0]?.value ?? '').toString();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(val) => setMyOption((prev: any) => ({ ...prev, [field]: val }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          {items.map((it) => (
            <SelectItem key={it.value} value={it.value}>
              {it.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* -----------------------------
   Option renderers (all cases)
------------------------------ */

function SexSelect({ myOption, setMyOption }: OptionRendererProps) {
  // normalize to string (shadcn Select expects string)
  const value = (myOption.sex ?? 'random').toString();

  return (
    <EnumSelect
      myOption={myOption}
      setMyOption={setMyOption}
      field="sex"
      label="sex"
      items={[
        { value: 'random', label: 'Random' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]}
    />
  );
}

function Price({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <MinMax
      myOption={myOption}
      setMyOption={setMyOption}
      minLabel="min"
      maxLabel="max"
      minPlaceholder="Example: 0"
      maxPlaceholder="Example: 1000"
    />
  );
}

function Past({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="past years"
      value={String(myOption.years ?? '')}
      placeholder="Example: 10"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, years: val }))}
    />
  );
}

function Lines({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="Line no"
      value={String(myOption.count ?? '')}
      placeholder="Example: 5"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, count: val }))}
    />
  );
}

function ImageUrl({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <div className="space-y-4">
      <Field
        label="width"
        value={String(myOption.width ?? '')}
        placeholder="Example: 480"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, width: val }))}
      />
      <Separator />
      <Field
        label="height"
        value={String(myOption.height ?? '')}
        placeholder="Example: 720"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, height: val }))}
      />
      <Separator />
      <Field
        label="category"
        value={String(myOption.category ?? '')}
        placeholder="Example: Cat"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, category: val }))}
      />
    </div>
  );
}

function Sentences({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="Sentence Count"
      value={String(myOption.sentenceCount ?? '')}
      placeholder="Example: 5"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, sentenceCount: val }))}
    />
  );
}

function Alpha({ myOption, setMyOption }: OptionRendererProps) {
  return <SimpleCount myOption={myOption} setMyOption={setMyOption} label="Number of character" />;
}

function AlphaNumeric({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <SimpleCount
      myOption={myOption}
      setMyOption={setMyOption}
      label="Number of alphaNumeric character"
    />
  );
}

function Numeric({ myOption, setMyOption }: OptionRendererProps) {
  return <SimpleCount myOption={myOption} setMyOption={setMyOption} label="Number of digit" />;
}

function Words({ myOption, setMyOption }: OptionRendererProps) {
  return <SimpleCount myOption={myOption} setMyOption={setMyOption} label="Number of word" />;
}

function SpecialCharacter({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <div className="space-y-4">
      <SimpleCount myOption={myOption} setMyOption={setMyOption} label="Number of word" />
      <Field
        label="Whitelist"
        value={String(myOption.whitelist ?? '')}
        placeholder="Example: ^&*#"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, whitelist: val }))}
      />
    </div>
  );
}

function ArrayOpt({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="Size of the array"
      value={String(myOption.length ?? '')}
      placeholder="Example: 5"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, length: val }))}
    />
  );
}

function BigInt({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <MinMax
      myOption={myOption}
      setMyOption={setMyOption}
      minLabel="min"
      maxLabel="max"
      minPlaceholder="Example: 0"
      maxPlaceholder="Example: 1000000"
    />
  );
}

function DatetimeMinMax({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <MinMax
      myOption={myOption}
      setMyOption={setMyOption}
      minLabel="min"
      maxLabel="max"
      minPlaceholder="Example: 631152000000"
      maxPlaceholder="Example: 4102444800000"
    />
  );
}

function FloatOpt({ myOption, setMyOption }: OptionRendererProps) {
  const { message, validate } = useMinMaxValidator();
  const min = String(myOption.min ?? '');
  const max = String(myOption.max ?? '');

  return (
    <div className="space-y-4">
      <Field
        label="min"
        value={min}
        placeholder="Example: 10"
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, min: val }));
          validate(val, String(myOption.max ?? ''));
        }}
      />
      <Separator />
      <Field
        label="max"
        value={max}
        placeholder="Example: 20"
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, max: val }));
          validate(String(myOption.min ?? ''), val);
        }}
      />

      <ErrorBanner message={message} />

      <Field
        label="precision"
        value={String(myOption.precision ?? '')}
        placeholder="Example: 0.01"
        inputMode="decimal"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, precision: val }))}
      />
    </div>
  );
}

function Hexadecimal({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <div className="space-y-4">
      <Field
        label="length"
        value={String(myOption.length ?? '')}
        placeholder="Example: 10"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, length: val }))}
      />

      <EnumSelect
        myOption={myOption}
        setMyOption={setMyOption}
        field="case"
        label="case"
        items={[
          { value: 'lower', label: 'lower case' },
          { value: 'upper', label: 'upper case' },
          { value: 'mixed', label: 'mixed case' },
        ]}
      />

      <Field
        label="prefix"
        value={String(myOption.prefix ?? '')}
        placeholder="Example: 0X"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, prefix: val }))}
      />
    </div>
  );
}

function NumberOpt({ myOption, setMyOption }: OptionRendererProps) {
  const { message, validate } = useMinMaxValidator();
  const min = String(myOption.min ?? '');
  const max = String(myOption.max ?? '');

  return (
    <div className="space-y-4">
      <Field
        label="min"
        value={min}
        placeholder="Example: 10"
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, min: val }));
          validate(val, String(myOption.max ?? ''));
        }}
      />

      <Separator />

      <Field
        label="max"
        value={max}
        placeholder="Example: 20"
        inputMode="numeric"
        onChange={(val) => {
          setMyOption((prev: any) => ({ ...prev, max: val }));
          validate(String(myOption.min ?? ''), val);
        }}
      />

      <ErrorBanner message={message} />

      <Field
        label="precision"
        value={String(myOption.precision ?? '')}
        placeholder="Example: 0.01"
        inputMode="decimal"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, precision: val }))}
      />
    </div>
  );
}

function StringOpt({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="length"
      value={String(myOption.length ?? '')}
      placeholder="Example: 10"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, length: val }))}
    />
  );
}

function Between({ myOption, setMyOption }: OptionRendererProps) {
  const from = fromISO(myOption.from);
  const to = fromISO(myOption.to);
  return (
    <div className="space-y-6">
      {/* FROM */}
      <div className="space-y-2">
        <Label>From</Label>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {from.date ? dayjs(from.date).format('YYYY-MM-DD') : 'Pick date'}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={from.date}
                onSelect={(date) => {
                  const iso = toISO(date, from.time);
                  if (!iso) return;
                  setMyOption((prev: any) => ({ ...prev, from: iso }));
                }}
              />
            </PopoverContent>
          </Popover>

          <Input
            type="time"
            step="1"
            className="w-[140px]"
            value={from.time}
            onChange={(e) => {
              const iso = toISO(from.date, e.target.value);
              if (!iso) return;
              setMyOption((prev: any) => ({ ...prev, from: iso }));
            }}
          />
        </div>
      </div>

      {/* TO */}
      <div className="space-y-2">
        <Label>To</Label>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {to.date ? dayjs(to.date).format('YYYY-MM-DD') : 'Pick date'}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={to.date}
                onSelect={(date) => {
                  const iso = toISO(date, to.time);
                  if (!iso) return;
                  setMyOption((prev: any) => ({ ...prev, to: iso }));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Input
            type="time"
            step="1"
            className="w-[140px]"
            value={to.time}
            onChange={(e) => {
              const iso = toISO(to.date, e.target.value);
              if (!iso) return;
              setMyOption((prev: any) => ({ ...prev, to: iso }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Betweens({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <div className="space-y-4">
      <Between myOption={myOption} setMyOption={setMyOption} />
      <Field
        label="Number of dates"
        value={String(myOption.num ?? '')}
        placeholder="Example: 10"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, num: val }))}
      />
    </div>
  );
}

function Birthdate({ myOption, setMyOption }: OptionRendererProps) {
  const mode = (myOption.mode ?? 'age').toString();

  return (
    <div className="space-y-4">
      <MinMax
        myOption={myOption}
        setMyOption={setMyOption}
        minPlaceholder="Example: 18"
        maxPlaceholder="Example: 60"
        validateLabelMessage={(m) => ({
          minMsg: `minimum ${m}`,
          maxMsg: `maximum ${m}`,
        })}
      />

      <EnumSelect
        myOption={myOption}
        setMyOption={setMyOption}
        field="mode"
        label="mode"
        items={[
          { value: 'age', label: 'age' },
          { value: 'year', label: 'year' },
        ]}
      />
    </div>
  );
}

function Future({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="years"
      value={String(myOption.years ?? '')}
      placeholder="Example: 10"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, years: val }))}
    />
  );
}

function Month({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <EnumSelect
      myOption={myOption}
      setMyOption={setMyOption}
      field="abbr"
      label="abbr"
      items={[
        { value: 'false', label: 'long form' },
        { value: 'true', label: 'abbreviation' },
      ]}
    />
  );
}

export function Recent({ myOption, setMyOption }: OptionRendererProps) {
  const ref = fromISO(myOption.refDate);

  return (
    <div className="space-y-4">
      {/* days */}
      <Field
        label="days"
        value={String(myOption.days ?? '')}
        placeholder="Example: 10"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, days: val }))}
      />

      <div className="space-y-2">
        <Label>Reference point</Label>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {ref.date ? dayjs(ref.date).format('YYYY-MM-DD') : 'Pick date'}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={ref.date}
                onSelect={(date) => {
                  const iso = toISO(date, ref.time);
                  if (!iso) return;
                  setMyOption((prev: any) => ({ ...prev, refDate: iso }));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Input
            type="time"
            step="1"
            className="w-[140px]"
            value={ref.time}
            onChange={(e) => {
              const iso = toISO(ref.date, e.target.value);
              if (!iso) return;
              setMyOption((prev: any) => ({ ...prev, refDate: iso }));
            }}
          />
        </div>

        {myOption.refDate && (
          <p className="text-xs text-muted-foreground">
            Stored: {dayjs(myOption.refDate).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        )}
      </div>
    </div>
  );
}

function Soon({ myOption, setMyOption }: OptionRendererProps) {
  return <Recent myOption={myOption} setMyOption={setMyOption} />;
}

function Weekday({ myOption, setMyOption }: OptionRendererProps) {
  return <Month myOption={myOption} setMyOption={setMyOption} />;
}

function CardinalDirection({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <BooleanSelect myOption={myOption} setMyOption={setMyOption} field="useAbbr" label="useAbbr" />
  );
}

function CountryCode({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <EnumSelect
      myOption={myOption}
      setMyOption={setMyOption}
      field="alphaCode"
      label="alphaCode"
      items={[
        { value: 'alpha-2', label: 'alpha-2' },
        { value: 'alpha-3', label: 'alpha-3' },
      ]}
    />
  );
}

function Direction({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <BooleanSelect myOption={myOption} setMyOption={setMyOption} field="useAbbr" label="useAbbr" />
  );
}

function Latitude({ myOption, setMyOption }: OptionRendererProps) {
  // same as number min/max + precision
  return (
    <div className="space-y-4">
      <NumberOpt myOption={myOption} setMyOption={setMyOption} />
      {/* but your label wants precision placeholder 5; keep it */}
      {/* precision already included; if you want different placeholder, we can split a dedicated GPS component */}
    </div>
  );
}

function Longitude({ myOption, setMyOption }: OptionRendererProps) {
  return <Latitude myOption={myOption} setMyOption={setMyOption} />;
}

function NearbyGPSCoordinate({ myOption, setMyOption }: OptionRendererProps) {
  const metric = (myOption.metric ?? 'KM').toString();

  return (
    <div className="space-y-4">
      <Field
        label="latitude"
        value={String(myOption.latitude ?? '')}
        placeholder="Example: 33"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, latitude: val }))}
      />
      <Field
        label="longitude"
        value={String(myOption.longitude ?? '')}
        placeholder="Example: 137"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, longitude: val }))}
      />
      <Field
        label="radius"
        value={String(myOption.radius ?? '')}
        placeholder="Example: 1000"
        inputMode="numeric"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, radius: val }))}
      />

      <EnumSelect
        myOption={{ ...myOption, metric }}
        setMyOption={setMyOption}
        field="metric"
        label="metric"
        items={[
          { value: 'KM', label: 'KM' },
          { value: 'MILE', label: 'MILE' },
        ]}
      />
    </div>
  );
}

function OrdinalDirection({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <BooleanSelect myOption={myOption} setMyOption={setMyOption} field="useAbbr" label="useAbbr" />
  );
}

function StreetAddress({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <BooleanSelect
      myOption={myOption}
      setMyOption={setMyOption}
      field="useFullAddress"
      label="useFullAddress"
    />
  );
}

function ZipCode({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="format"
      value={String(myOption.format ?? '')}
      placeholder="Example: #####"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, format: val }))}
    />
  );
}

function ZipCodeByState({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="state"
      value={String(myOption.state ?? '')}
      placeholder="Example: AK"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, state: val }))}
    />
  );
}

function CommonFileName({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="ext"
      value={String(myOption.ext ?? '')}
      placeholder="Example: txt"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, ext: val }))}
    />
  );
}

function FileName({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <Field
      label="extensionCount"
      value={String(myOption.extensionCount ?? '')}
      placeholder="Example: 2"
      inputMode="numeric"
      onChange={(val) => setMyOption((prev: any) => ({ ...prev, extensionCount: val }))}
    />
  );
}

function NetworkInterface({ myOption, setMyOption }: OptionRendererProps) {
  const interfaceSchema = (myOption.interfaceSchema ?? 'slot').toString();
  const interfaceType = (myOption.interfaceType ?? 'en').toString();

  return (
    <div className="space-y-4">
      <EnumSelect
        myOption={{ ...myOption, interfaceSchema }}
        setMyOption={setMyOption}
        field="interfaceSchema"
        label="interfaceSchema"
        items={[
          { value: 'slot', label: 'slot' },
          { value: 'index', label: 'index' },
          { value: 'mac', label: 'mac' },
          { value: 'pci', label: 'pci' },
        ]}
      />

      <EnumSelect
        myOption={{ ...myOption, interfaceType }}
        setMyOption={setMyOption}
        field="interfaceType"
        label="interfaceType"
        items={[
          { value: 'en', label: 'en' },
          { value: 'wl', label: 'wl' },
          { value: 'ww', label: 'ww' },
        ]}
      />
    </div>
  );
}

function Email({ myOption, setMyOption }: OptionRendererProps) {
  return (
    <div className="space-y-4">
      <Field
        label="first Name"
        value={String(myOption.firstName ?? '')}
        placeholder="Example: Jeanne"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, firstName: val }))}
      />
      <Field
        label="last Name"
        value={String(myOption.lastName ?? '')}
        placeholder="Example: Doe"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, lastName: val }))}
      />
      <Field
        label="provider"
        value={String(myOption.provider ?? '')}
        placeholder="Example: example.fakerjs.dev"
        onChange={(val) => setMyOption((prev: any) => ({ ...prev, provider: val }))}
      />
    </div>
  );
}

/* -----------------------------
   Mapping table
------------------------------ */

const OPTION_RENDERERS: Record<string, React.FC<OptionRendererProps>> = {
  firstName: SexSelect,
  lastName: SexSelect,
  price: Price,
  past: Past,
  lines: Lines,
  imageUrl: ImageUrl,
  sentences: Sentences,
  alpha: Alpha,
  alphaNumeric: AlphaNumeric,
  numeric: Numeric,
  words: Words,
  specialCharacter: SpecialCharacter,
  array: ArrayOpt,
  bigInt: BigInt,
  datetime: DatetimeMinMax,
  float: FloatOpt,
  hexadecimal: Hexadecimal,
  number: NumberOpt,
  string: StringOpt,
  between: Between,
  betweens: Betweens,
  birthdate: Birthdate,
  future: Future,
  month: Month,
  recent: Recent,
  soon: Soon,
  weekday: Weekday,
  cardinalDirection: CardinalDirection,
  countryCode: CountryCode,
  direction: Direction,
  latitude: Latitude,
  longitude: Longitude,
  nearbyGPSCoordinate: NearbyGPSCoordinate,
  ordinalDirection: OrdinalDirection,
  streetAddress: StreetAddress,
  zipCode: ZipCode,
  zipCodeByState: ZipCodeByState,
  commonFileName: CommonFileName,
  fileName: FileName,
  networkInterface: NetworkInterface,
  email: Email,
};

export default SchemaOptionModal;
