import { ComponentProps } from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useFieldContext } from "./form-hooks";

interface TextFieldProps extends ComponentProps<"div"> {
  label: string;
  placeholder: string;
}

export const TextAreaField = ({ label, placeholder, className, ...rest }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className={cn("space-y-2 grow", className)} {...rest}>
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
};
