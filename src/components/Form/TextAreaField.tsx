import { cn } from "#src/lib/utils";
import { LabelProps } from "@radix-ui/react-label";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useFieldContext } from "./form-hooks";

interface TextFieldProps extends LabelProps {
  label: string;
  placeholder: string;
}

export const TextAreaField = ({ label, placeholder, className, ...rest }: TextFieldProps) => {
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
    </Label>
  );
};
