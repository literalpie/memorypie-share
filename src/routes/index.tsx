import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Label } from "@radix-ui/react-label";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});


function RouteComponent() {
  const { folders } = useQuery(api.tasks.listFolders) ?? {};
  const createFolder = useMutation(api.tasks.createFolder);
  const [files, setFiles] = useState<File[] | undefined>();
  const [newFolderName, setNewFolderName] = useState("");

  if (folders === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <main className="p-8 flex flex-col gap-16">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Shared Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {folders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No folders created yet
                </p>
              ) : (
                <>
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">
                        <Link to={`/${folder.slug}`}>{folder.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.slug}
                      </p>
                    </div>
                    <Badge>{folder.itemCount} items</Badge>
                  </div>
                ))}
                <div
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">
                        <Link to='/new'>Make New Shared Folder</Link>
                      </h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create New Shared Folder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Folder Name Input */}
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="Enter folder name..."
              />
            </div>

            {/* File Dropzone */}
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <Dropzone
                src={files}
                onDrop={(a) => {
                  a.at(0)
                    ?.text()
                    .catch(() => {});
                  setFiles(a);
                }}
              >
                <DropzoneContent />
                <DropzoneEmptyState />
              </Dropzone>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => {
                const doIt = async () => {
                  const contents = JSON.parse(
                    (await files?.at(0)?.text()) ?? "{}",
                  );
                  console.log("contents", contents);
                  if (!contents.memories) {
                    return;
                  }
                  const rand = Math.round(Math.random() * 1000);
                  createFolder({
                    slug: `folder-${rand}`,
                    memItems: contents.memories,
                    title: newFolderName,
                  }).catch(() => {});
                };
                doIt().catch(() => {});
              }}
              className="w-full"
              disabled={!newFolderName || !files?.length}
            >
              Create Folder
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
