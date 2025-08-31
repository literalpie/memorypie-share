import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Label } from "@radix-ui/react-label";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function HomeContent() {
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
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Shared Sets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {folders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No folders created yet
              </p>
            ) : (
              folders.map((folder) => (
                <div
                  key={folder._id}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{folder.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {folder.slug}
                    </p>
                  </div>
                  <Badge>{folder.itemCount} items</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Shared Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="set-name">Set Name</Label>
            <Input
              id="set-name"
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="Enter set name..."
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
  );
}