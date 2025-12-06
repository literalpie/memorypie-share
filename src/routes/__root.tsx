import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { UserButton } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const routedFolderSlug = Route.useMatch().params.folderSlug;
  const { folders } = useQuery(api.tasks.listFolders) ?? {};

  return (
    <div className="flex flex-row">
      <div className="w-52 h-screen border-divider border-e shrink-0 flex flex-col">
        <header className="p-4 border-b border-divider flex flex-row justify-between items-center font-extrabold">
          <h1>
            <Link to="/">Memorypie Share</Link>
          </h1>
          <UserButton />
        </header>
        <div className="flex flex-col grow overflow-y-auto">
          {(folders?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground text-center py-4">No folders created yet</p>
          ) : (
            folders?.map((folder) => (
              <Button
                data-active={routedFolderSlug === folder.slug}
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
        <Button variant="primary" className="m-2" asChild>
          <Link to="/new">New Shared Folder</Link>
        </Button>
      </div>
      <div className="overflow-y-auto h-screen grow">
        <Outlet />
      </div>
    </div>
  );
}
