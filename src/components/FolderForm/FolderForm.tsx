import { api } from "#convex/_generated/api";
import { Separator } from "@radix-ui/react-separator";
import { FunctionArgs, FunctionReturnType } from "convex/server";
import { Trash } from "lucide-react";
import slugify from "slugify";
import z from "zod";

import { useAppForm } from "../Form/useAppForm";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

export type GetFolder = FunctionReturnType<typeof api.tasks.getFolder>["folder"];
export type CreateFolder = FunctionArgs<typeof api.tasks.createFolder>;
export type Folder = CreateFolder | GetFolder;

export const FolderForm = ({
  initialValue,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText,
}: {
  submitButtonText: string;
  submitButtonLoadingText: string;
  initialValue?: Folder;
  onSubmit: (value: Folder) => Promise<void>;
}) => {
  const form = useAppForm({
    defaultValues: initialValue ?? {
      title: "",
      slug: "",
      memItems: [],
    },
    validators: {
      onChange: z
        .object({
          title: z.string().min(1),
          slug: z.string().min(3),
          memItems: z
            .array(
              z
                .object({
                  title: z.string(),
                  text: z.string(),
                })
                .required(),
            )
            .refine(
              (items) =>
                items.length > 1 &&
                items.every(
                  (item, index) =>
                    (item.text.length > 0 && item.title.length > 0) ||
                    (index === items.length - 1 &&
                      item.text.length === 0 &&
                      item.title.length === 0),
                ),
              { message: "All items must have a Title and Text" },
            ),
        })
        .required(),
    },
    listeners: {
      onMount: ({ formApi }) => {
        const last = formApi.state.values.memItems.at(-1);
        if (!last || (last.text.length > 0 && last.title.length > 0)) {
          formApi.pushFieldValue("memItems", { text: "", title: "" });
        }
      },
      onChange: ({ formApi }) => {
        const last = formApi.state.values.memItems.at(-1);
        if (!last || (last.text.length > 0 && last.title.length > 0)) {
          formApi.pushFieldValue("memItems", { text: "", title: "" });
        }
      },
    },
    onSubmit: async ({ value }) =>
      onSubmit({
        ...value,
        slug: slugify(value.slug, { lower: true, strict: true }),
        memItems: value.memItems.filter(
          // Filter out the last item, which will always be empty
          (item) => item.text.length > 0 && item.title.length > 0,
        ),
      }),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch(() => {});
      }}
      className="space-y-4"
    >
      <div className="flex flex-row gap-2">
        <form.AppField
          name="title"
          children={(field) => <field.TextField className="flex-1" label="Title" />}
        />

        <form.AppField
          name="slug"
          children={(field) => (
            <div className="flex-1">
              <field.TextField label="Slug (URL name)" />
              <span className="text-secondary-text text-sm">
                memorypie.app/shared/{slugify(field.state.value, { lower: true, strict: true })}
              </span>
            </div>
          )}
        />
      </div>
      <Card className="p-3">
        <CardTitle>
          <h3>Memorization Items</h3>
        </CardTitle>
        <form.Field
          name="memItems"
          children={(itemsField) => (
            <div className="space-y-4">
              {itemsField.state.value.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No items yet. Click "Add Item" to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itemsField.state.value.map((_, i) => (
                    <>
                      <div key={i} className="flex flex-col sm:flex-row gap-4">
                        <form.AppField name={`memItems[${i}].title`}>
                          {(itemTitleField) => (
                            <itemTitleField.TextField className="grow basis-0" label="Item Title" />
                          )}
                        </form.AppField>

                        <form.AppField name={`memItems[${i}].text`}>
                          {(itemTextField) => (
                            <itemTextField.TextAreaField
                              className="grow-2 basis-0"
                              label="Item Text"
                              placeholder="Enter the text that you would like to memorize"
                            />
                          )}
                        </form.AppField>
                        <Button
                          type="button"
                          className="sm:self-start self-center border-0 rounded-full"
                          onClick={() => itemsField.removeValue(i)}
                        >
                          <Trash />
                        </Button>
                      </div>
                      <Separator />
                    </>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </Card>

      <div className="flex">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              variant="primary"
              className="disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">{submitButtonLoadingText}</div>
              ) : (
                <div className="flex items-center gap-2">{submitButtonText}</div>
              )}
            </Button>
          )}
        />
      </div>
    </form>
  );
};
