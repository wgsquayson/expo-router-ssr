import { useMemo, useState } from "react";

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

export function useFormState<T extends Record<string, any>>(
  initial: T,
  validate?: Validator<T>,
  required: (keyof T)[] = [],
) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  function setField<K extends keyof T>(key: K, value: T[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };

      if (validate) {
        setErrors(validate(next));
      }

      return next;
    });

    // marca como tocado ao digitar
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function touchField<K extends keyof T>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function setFieldError<K extends keyof T>(key: K, value: string) {
    setErrors((prev) => ({ ...prev, [key]: value }));
  }

  function runValidation() {
    if (!validate) return true;

    const newErrors = validate(values);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const isValid = useMemo(() => {
    const noErrors = Object.values(errors).every((e) => !e);

    const allRequiredFilled = required.every((key) => {
      const v = values[key];
      return v !== "" && v !== null && v !== undefined;
    });

    return noErrors && allRequiredFilled;
  }, [errors, values, required]);

  function getFieldError<K extends keyof T>(key: K) {
    if (!touched[key]) return undefined;
    return errors[key];
  }

  return {
    values,
    errors,
    touched,
    setField,
    touchField,
    runValidation,
    isValid,
    setFieldError,
    getFieldError,
  };
}
