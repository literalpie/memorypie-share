import { Separator } from "@radix-ui/react-separator";
import { api } from "../../../convex/_generated/api";
import { FunctionArgs } from "convex/server";
import { Trash, Plus } from "lucide-react";
import z from "zod";
import { Button } from "../ui/button";
import { useAppForm } from "../Form/useAppForm";
import { Card, CardTitle } from "../ui/card";

type Folder = FunctionArgs<typeof api.tasks.createFolder> | FunctionArgs<typeof api.tasks.updateFolder>;

export const FolderForm = ({
  initialValue,
  onSubmit,
}: {
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
      onChange: z.object({
        title: z.string().min(1),
        slug: z.string().min(3),
        memItems: z.array(
          z.object({
            title: z.string().min(1),
            text: z.string().min(1),
          }).required(),
        ),
      }).required(),
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch(() => {});
      }}
      className="space-y-6"
    >
      <div className="flex flex-row gap-2">
        <form.AppField
          name="title"
          children={(field) => <field.TextField label="Title"/>}
        />

        <form.AppField
          name="slug"
          children={(field) => <field.TextField label="Slug (URL name)"/>}
        />
      </div>
      <Card className="p-3 border">
        <CardTitle>
          <h3>Memorization Items</h3>
        </CardTitle>
        <form.Field
          name="memItems"
          children={(itemsField) => (
            <div className="space-y-4">
              {itemsField.state.value.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">
                    No items yet. Click "Add Item" to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itemsField.state.value.map((_, i) => (
                    <>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <form.AppField name={`memItems[${i}].title`}>
                          {(itemTitleField) => (
                            <itemTitleField.TextField className="grow-1 basis-0" label="Item Title" />
                          )}
                        </form.AppField>

                        <form.AppField name={`memItems[${i}].text`}>
                          {(itemTextField) => (
                            <itemTextField.TextAreaField className="grow-2 basis-0" label="Item Text" placeholder="Enter the text that you would like to memorize"/>
                          )}
                        </form.AppField>
                        <Button
                          type="button"
                          className="self-center border-0 rounded-full"
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

              <Button
                type="button"
                onClick={() => itemsField.pushValue({ title: "", text: "" })}
                className="w-full h-12 border-dashed border-2 border-slate-300 hover:border-green-400 hover:bg-green-50 text-slate-600 hover:text-green-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </div>
          )}
        />
      </Card>

      <div className="flex">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">Creating...</div>
              ) : (
                <div className="flex items-center gap-2">Create Folder</div>
              )}
            </Button>
          )}
        />
      </div>
    </form>
  );
};