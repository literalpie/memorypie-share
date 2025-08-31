import { createFileRoute, nav, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const createFolder = useMutation(api.tasks.createFolder);
  const navigate = Route.useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      items: [] as { title: string; text: string }[],
    },
    validators: {
      onChange: z.object({
        title: z.string(),
        slug: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            text: z.string(),
          }),
        ),
      }),
    },
    onSubmit: ({ value }) => {
      return createFolder({
        slug: value.slug,
        title: value.title,
        memItems: value.items,
      }).then(a=>{
        return navigate({to: '/'})
      });
    },
  });

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Create New Shared Folder
        </h1>
        <p className="text-slate-600 text-lg">
          This folder and all of its items will be available to anyone with the
          link
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(() => {});
        }}
        className="space-y-6"
      >
        <form.Field
          name="title"
          children={(field) => (
            <div className="space-y-2 grow">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={field.state.value}
                name={field.name}
                onBlur={field.handleBlur}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <form.Field
          name="slug"
          children={(field) => (
            <div className="space-y-2 grow">
              <Label htmlFor="folder-slug">Slug (URL name)</Label>
              <Input
                id="folder-slug"
                value={field.state.value}
                name={field.name}
                onBlur={field.handleBlur}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <fieldset className="p-2 border">
          <h3 className="mb-3">Memorization Items</h3>
          <form.Field
            name="items"
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
                          <form.Field name={`items[${i}].title`}>
                            {(itemTitleField) => (
                              <div className="space-y-2 sm:w-56 flex-shrink-0">
                                <Label htmlFor={`${i}-title`}>Item Title</Label>
                                <Input
                                  id={`${i}-title`}
                                  value={itemTitleField.state.value}
                                  onBlur={itemTitleField.handleBlur}
                                  type="text"
                                  placeholder="Enter a title for this item"
                                  onChange={(e) =>
                                    itemTitleField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )}
                          </form.Field>

                          <form.Field name={`items[${i}].text`}>
                            {(itemTextField) => (
                              <div className="space-y-2 flex-1 min-w-0">
                                <Label
                                  htmlFor={`${i}-text`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Content
                                </Label>
                                <Textarea
                                  id={`${i}-text`}
                                  value={itemTextField.state.value}
                                  onBlur={itemTextField.handleBlur}
                                  placeholder="Enter the text you would like to memorize"
                                  className="min-h-[80px] border-slate-200 focus:border-green-500 focus:ring-green-500/20 resize-none"
                                  onChange={(e) =>
                                    itemTextField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )}
                          </form.Field>
                          <Button
                            className="self-center"
                            variant="secondary"
                            size="icon"
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
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-slate-300 hover:border-green-400 hover:bg-green-50 text-slate-600 hover:text-green-700 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </div>
            )}
          />
        </fieldset>

        {/* Submit Button */}
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
    </div>
  );
}
