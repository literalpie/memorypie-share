import { cn } from "#src/lib/utils";
import { LabelProps } from "@radix-ui/react-label";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ErrorsList } from "./ErrorsList";
import { useFieldContext } from "./form-hooks";

interface TextFieldProps extends LabelProps {
  label: string;
  placeholder: string;
  errors?: string[];
}

export const TextAreaField = ({
  label,
  placeholder,
  className,
  errors,
  ...rest
}: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <Label
      className={cn("space-y-2 grow flex flex-col items-start", className)}
      {...rest}
      htmlFor={field.name}
    >
      {label}
      <Textarea
        id={field.name}
        className="placeholder:text-secondary-text"
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {errors && errors.length > 0 && <ErrorsList errors={errors} />}
    </Label>
  );
};
