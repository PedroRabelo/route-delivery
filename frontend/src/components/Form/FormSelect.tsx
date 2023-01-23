import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames";
import get from "lodash.get";
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister
} from "react-hook-form";
import { FormErrorMessage } from "../Form";

export type InputSize = "medium" | "large";

export type FormSelectProps<TFormValues extends FieldValues> = {
  id: string;
  name: Path<TFormValues>;
  value?: "id" | "name";
  size?: InputSize;
  options: { id: string; name: string; title?: string }[];
  className?: string;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  errors?: Partial<DeepMap<TFormValues, FieldError>>;
  onChange?: (arg: any) => any;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

const sizeMap: { [key in InputSize]: string } = {
  medium: "p-3 text-base",
  large: "p-4 text-base",
};

export const SelectInput = <TFormValues extends Record<string, unknown>>({
  id,
  name,
  value,
  size,
  options,
  register,
  rules,
  errors,
  className,
  onChange,
  ...props
}: FormSelectProps<TFormValues>): JSX.Element => {
  // If the name is in a FieldArray, it will be 'fields.index.fieldName' and errors[name] won't return anything, so we are using lodash get
  const errorMessages = get(errors, name);
  const hasError = !!(errors && errorMessages);

  return (
    <div className={classNames("", className)} aria-live="polite">
      <select
        id={id}
        name={name}
        aria-invalid={hasError}
        className={classNames([
          "relative inline-flex p-3 text-base w-full rounded-md leading-none transition-colors ease-in-out placeholder-gray-500 text-gray-700 bg-gray-50 border border-gray-300 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30",
          className,
          hasError
            ? "transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 border-red-600 hover:border-red-600 focus:border-red-600 focus:ring-red-600"
            : "",
        ])}
        {...props}
        {...(register && register(name, rules))}
        onChange={onChange}
      >
        <option></option>
        {options?.length > 0 &&
          options.map((option) => (
            <option
              key={option.id}
              value={value === "id" ? option.id : option.name}
            >
              {option.name ? option.name : option.title}
            </option>
          ))}
      </select>
      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => (
          <FormErrorMessage className="mt-1">{message}</FormErrorMessage>
        )}
      />
    </div>
  );
};
