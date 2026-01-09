import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { FoldersList } from "./-components/folders-list";
import { SignInForm } from "./-components/sign-in-form";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isSignedIn } = useAuth();
  return (
    <div className="flex flex-row">
      <div className="w-52 h-screen border-divider border-e shrink-0 flex flex-col">
        <header className="p-4 border-b border-divider flex flex-row justify-between items-center font-extrabold">
          <h1>
            <Link to="/">Memorypie Share</Link>
          </h1>
          <UserButton />
        </header>
        {isSignedIn ? (
          <>
            <FoldersList />
            <Button variant="primary" className="m-2" asChild>
              <Link to="/new">New Shared Folder</Link>
            </Button>
          </>
        ) : (
          <SignInForm />
        )}
      </div>
      <div className="overflow-y-auto h-screen grow">
        <Outlet />
      </div>
    </div>
  );
}
