import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-hooks";
import { TextAreaField } from "./TextAreaField";
import { TextField } from "./TextField";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField
  },
  formComponents: {},
});
