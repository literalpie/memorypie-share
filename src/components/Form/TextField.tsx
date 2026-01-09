import { useFieldContext } from "./form-hooks";
import { cn } from "#src/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LabelProps } from "@radix-ui/react-label";

interface TextFieldProps extends LabelProps {
  label: string;
}

export const TextField = ({ label, className, ...rest }: TextFieldProps) => {
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
    </Label>
  );
};
