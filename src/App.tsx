"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + React + Clerk
        <UserButton />
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">
          Convex + React + Clerk
        </h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see the numbers</p>
      <SignInButton mode="modal">
        <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}

function Content() {
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
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>
        <Label>
          Folder Name
          <Input
            value={newFolderName}
            onChange={(event) => setNewFolderName(event.target.value)}
          />
        </Label>
        <Dropzone
          src={files}
          onDrop={(a) => {
            a.at(0)?.text().then(console.log).catch(()=>{});
            setFiles(a);
          }}
        >
          <DropzoneContent />
          <DropzoneEmptyState />
        </Dropzone>
        <Button
          onClick={() => {
            const doIt = async () => {
              const contents = JSON.parse((await files?.at(0)?.text()) ?? "{}");
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
        >
          Add a Folder
        </Button>
      </p>
      <p>
        Folders:{" "}
        {folders.map((folder) => (
          <div key={folder._id}>
            {folder.title} - {folder.slug} - {folder.itemCount}
          </div>
        ))}
      </p>
    </div>
  );
}
