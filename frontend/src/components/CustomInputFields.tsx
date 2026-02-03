import * as React from 'react';
import { getIn, type FormikErrors, type FormikTouched } from 'formik';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

type CustomPwdFieldProps<T extends Record<string, any>> = {
  field?: keyof T & string;
  label?: string;

  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  values: T;
  touched: FormikTouched<T>;
  errors: FormikErrors<T>;
};

export function CustomPwdField<T extends Record<string, any>>({
  field = 'password',
  label = 'password',
  handleBlur,
  handleChange,
  values,
  touched,
  errors,
}: CustomPwdFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const hasError = Boolean(getIn(touched, field) && getIn(errors, field));
  const errorText = hasError ? String(getIn(errors, field)) : undefined;

  const inputId = field;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm">
        {label}
      </Label>

      <div className="relative">
        <Input
          id={inputId}
          name={field}
          type={showPassword ? 'text' : 'password'}
          value={(values[field] ?? '') as string}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={hasError}
          className={[
            'pr-10',
            hasError ? 'border-destructive focus-visible:ring-destructive' : '',
          ].join(' ')}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>

      {hasError ? <p className="text-xs text-destructive">{errorText}</p> : null}
    </div>
  );
}
