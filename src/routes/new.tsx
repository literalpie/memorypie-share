import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "#convex/_generated/api";
import { FolderForm } from "#src/components/FolderForm/FolderForm";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const createFolder = useMutation(api.tasks.createFolder);
  const navigate = Route.useNavigate();

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Create New Shared Folder</h2>
        <p className="text-lg font-extralight">
          This folder and all of its items will be available to anyone with the link
        </p>
      </div>
      <FolderForm
        onSubmit={async (value) => {
          await createFolder({
            slug: value.slug,
            title: value.title,
            memItems: value.memItems,
          });
          await navigate({ to: "/" });
        }}
        submitButtonText="Create Folder"
        submitButtonLoadingText="Creating..."
      />
    </div>
  );
}
