import { cn } from "#src/lib/utils";
import { LabelProps } from "@radix-ui/react-label";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ErrorsList } from "./ErrorsList";
import { useFieldContext } from "./form-hooks";

interface TextFieldProps extends LabelProps {
  label: string;
  errors?: string[];
}

export const TextField = ({ label, className, errors, ...rest }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <Label
      htmlFor={field.name}
      className={cn("grow flex flex-col items-start", className)}
      {...rest}
    >
      {label}
      <Input
        id={field.name}
        value={field.state.value}
        name={label}
        onBlur={field.handleBlur}
        type="text"
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {errors && errors.length > 0 && <ErrorsList errors={errors} />}
    </Label>
  );
};
