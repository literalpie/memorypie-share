import { useQuery } from "convex/react";
import { Button } from "#src/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { api } from "#convex/_generated/api";

export const FoldersList = () => {
  const { folderSlug }: { folderSlug?: string } = useParams({ strict: false });

  const { folders } = useQuery(api.tasks.listFolders) ?? {};

  return (
    <div className="flex flex-col grow overflow-y-auto">
      {(folders?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground text-center py-4">No folders created yet</p>
      ) : (
        folders?.map((folder) => (
          <Button
            data-active={folderSlug === folder.slug}
            variant="navigation"
            key={folder._id}
            asChild
          >
            <Link to={`/${folder.slug}`}>{folder.title}</Link>
          </Button>
        ))
      )}
      <div className="grow data-[active]-border" />
    </div>
  );
};
