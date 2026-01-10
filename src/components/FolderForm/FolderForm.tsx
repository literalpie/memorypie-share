import { api } from "#convex/_generated/api";
import { Separator } from "@radix-ui/react-separator";
import { revalidateLogic } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { FunctionArgs, FunctionReturnType } from "convex/server";
import { Trash } from "lucide-react";
import slugify from "slugify";
import z from "zod";

import { ErrorsList } from "../Form/ErrorsList";
import { useAppForm } from "../Form/useAppForm";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

export type GetFolder = FunctionReturnType<typeof api.tasks.getFolder>["folder"];
export type CreateFolder = FunctionArgs<typeof api.tasks.createFolder>;
export type Folder = CreateFolder | GetFolder;

const getButtonLabel = ({
  isSubmitting,
  isEditing,
}: {
  isSubmitting: boolean;
  isEditing: boolean;
}) => {
  if (isSubmitting) {
    if (isEditing) {
      return "Updating...";
    } else {
      return "Creating...";
    }
  }
  if (isEditing) {
    return "Update Folder";
  }
  return "Create Folder";
};

const errorsAsStrings = (errors: ({ message: string } | undefined)[]) => {
  return errors.map((e) => e?.message).filter(Boolean) as string[];
};

export const FolderForm = ({
  initialValue,
  onSubmit,
  isEditing = false,
}: {
  initialValue?: Folder;
  onSubmit: (value: Folder) => Promise<void>;
  /** Changes submit button text, and whether slug can be edited */
  isEditing?: boolean;
}) => {
  const form = useAppForm({
    defaultValues: initialValue ?? {
      title: "",
      slug: "",
      memItems: [],
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z
        .object({
          title: z.string().min(1).max(100),
          slug: z.string().min(3).max(50),
          memItems: z
            .array(
              z
                .object({
                  title: z.string().max(100),
                  text: z.string().max(10_000),
                })
                .required(),
            )
            .refine(
              (items) => items.filter((i) => i.text.length > 0 || i.title.length > 0).length >= 1,
              {
                message: "Folders must have at least one memorization item",
              },
            )
            .refine(
              (items) =>
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
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="flex flex-row gap-4">
        <form.AppField
          name="title"
          children={(field) => (
            <field.TextField
              errors={errorsAsStrings(field.state.meta.errors)}
              className="flex-1"
              label="Title"
            />
          )}
        />

        <form.AppField
          name="slug"
          children={(field) => {
            const urlWithSlug = `memorypie.app/shared/${slugify(field.state.value, { lower: true, strict: true })}`;
            return isEditing ? (
              <Label className="flex-col items-start flex-1">
                Link
                <Button variant="link" asChild className="grow">
                  <Link to={urlWithSlug}>{urlWithSlug}</Link>
                </Button>
              </Label>
            ) : (
              <div className="flex-1">
                <field.TextField
                  label="Slug (URL name)"
                  errors={errorsAsStrings(field.state.meta.errors)}
                />
                <span className="text-secondary-text text-sm">{urlWithSlug}</span>
              </div>
            );
          }}
        />
      </div>
      <Card className="p-3">
        <CardTitle>
          <h3>Memorization Items</h3>
        </CardTitle>
        <form.Field
          name="memItems"
          children={(itemsField) => {
            console.log("items errors", itemsField.state.meta.errors);
            return (
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
                              <itemTitleField.TextField
                                className="grow basis-0"
                                label="Item Title"
                                errors={errorsAsStrings(itemTitleField.state.meta.errors)}
                              />
                            )}
                          </form.AppField>

                          <form.AppField name={`memItems[${i}].text`}>
                            {(itemTextField) => (
                              <itemTextField.TextAreaField
                                className="grow-2 basis-0"
                                label="Item Text"
                                placeholder="Enter the text that you would like to memorize"
                                errors={errorsAsStrings(itemTextField.state.meta.errors)}
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
                        {i < itemsField.state.value.length - 1 ? (
                          <Separator className="bg-secondary-text h-px sm:h-0" />
                        ) : null}
                      </>
                    ))}
                    <ErrorsList errors={errorsAsStrings(itemsField.state.meta.errors)} />
                  </div>
                )}
              </div>
            );
          }}
        />
      </Card>

      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.errors]}
        children={([isSubmitting]) => {
          return (
            <Button type="submit" variant="primary">
              {getButtonLabel({ isSubmitting: !!isSubmitting, isEditing: isEditing })}
            </Button>
          );
        }}
      />
    </form>
  );
};
