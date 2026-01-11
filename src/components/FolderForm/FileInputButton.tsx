import { useRef } from "react";

import { Button, ButtonProps } from "../ui/button";

export const FileInputButton = ({
  onFileSelect,
  ...rest
}: { onFileSelect: (files: FileList) => void } & Omit<ButtonProps, "onClick">) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            onFileSelect(files);
            event.target.value = "";
          }
        }}
      />

      <Button
        {...rest}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      />
    </>
  );
};
