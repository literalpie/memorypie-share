import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/$folderSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderSlug } = Route.useParams();
  const { folder } = useQuery(api.tasks.getFolder, { folderSlug }) ?? {};
  return (
    <div>
      folder: {folder?.title}{" "}
      {folder?.memItems.map((item) => (
        <div>{item.title}</div>
      ))}
    </div>
  );
}
