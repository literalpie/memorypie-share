import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useFieldContext } from "./form-hooks";
import { LabelProps } from "@radix-ui/react-label";

interface TextFieldProps extends LabelProps {
  label: string;
  placeholder: string;
}

export const TextAreaField = ({
  label,
  placeholder,
  className,
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
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </Label>
  );
};
