import { ComponentProps } from "react";
import { useFieldContext } from "./form-hooks";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TextFieldProps extends ComponentProps<'div'> {
  label: string;
}

export const TextField = ({ label, className, ...rest }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className={cn("space-y-2 grow", className)} {...rest}>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        name={label}
        onBlur={field.handleBlur}
        type="text"
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
};
