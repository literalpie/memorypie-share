import { Button, ButtonProps } from "../ui/button";

export const DownloadFileButton = ({
  getFileInfo,
  ...rest
}: Omit<ButtonProps, "onClick"> & {
  getFileInfo: () => { fileTitle: string; fileText: string };
}) => {
  return (
    <Button
      {...rest}
      onClick={() => {
        const { fileTitle, fileText } = getFileInfo();
        const blob = new Blob([fileText], { type: "application/json;charset=utf-8" });

        // Create a hidden link and download the file by clicking it
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = window.URL.createObjectURL(blob);
        a.setAttribute("download", `${fileTitle}.json`);
        a.click();
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }}
    >
      Export
    </Button>
  );
};
