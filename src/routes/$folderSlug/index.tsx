import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { FolderForm } from "@/components/FolderForm/FolderForm";

export const Route = createFileRoute("/$folderSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderSlug } = Route.useParams();
  const updateFolder = useMutation(api.tasks.updateFolder);

  const { folder } = useQuery(api.tasks.getFolder, { folderSlug }) ?? {};
  if (folder === undefined) {
    return <div>Loading or not found</div>;
  }
  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Update Shared Folder</h2>
        <p className="text-lg">
          This folder and all of its items will be available to anyone with the
          link
        </p>
      </div>
      <FolderForm
        initialValue={folder}
        onSubmit={async (value) => {
          console.log("submitted value", value, {
            slug: value.slug,
            title: value.title,
            id: value._id,
            memItems: value.memItems.map((item) => ({
              text: item.text,
              title: item.title,
              _id: (item as any)._id,
            })),
          });
          await updateFolder({
            slug: value.slug,
            title: value.title,
            id: value._id,
            memItems: value.memItems.map((item) => ({
              text: item.text,
              title: item.title,
              _id: (item as any)._id,
            })),
          });
        }}
      />
    </div>
  );
}
