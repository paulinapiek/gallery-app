import { useState, useRef, useEffect, useCallback } from "react";
import * as LR from "@uploadcare/blocks";
import { OutputFileEntry } from "@uploadcare/blocks";
import blocksStyles from "@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url";
import { FileEntry } from "@/types";
import styled from "styled-components";

LR.registerBlocks(LR);

interface IFileUploaderProps {
  fileEntry: FileEntry;
  onChange: (fileEntry: FileEntry) => void;
  preview: boolean;
}


const UploaderWrapper = styled.div`
  /* Możesz dodać dodatkowe style dla całego komponentu, jeśli potrzebujesz */
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const PreviewContainer = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  display: block;
`;

const RemoveButtonContainer = styled.div`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: white;
  border: 2px solid #1e293b; /* border-slate-800 */
  border-radius: 50%;
  width: 1.75rem; /* odpowiada w-7 */
  height: 1.75rem; /* odpowiada h-7 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  color: #1e293b;
  text-align: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
`;

const FileUploader: React.FC<IFileUploaderProps> = ({
  fileEntry,
  onChange,
  preview,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<OutputFileEntry[]>([]);
  const ctxProviderRef = useRef<
    (typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider) | null
  >(null);

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry["uuid"]) =>
      onChange({ files: fileEntry.files.filter((f) => f.uuid !== uuid) }),
    [fileEntry.files, onChange]
  );

  useEffect(() => {
    const handleUploadEvent = (e: CustomEvent<OutputFileEntry[]>) => {
      if (e.detail) {
        console.log("The uploaded file event is: ", e);
        setUploadedFiles([...e.detail]);
      }
    };
    ctxProviderRef.current?.addEventListener("data-output", handleUploadEvent);
    return () => {
      ctxProviderRef.current?.removeEventListener(
        "data-output",
        handleUploadEvent
      );
    };
  }, [setUploadedFiles]);

  useEffect(() => {
    const resetUploaderState = () =>
      ctxProviderRef.current?.uploadCollection.clearAll();

    const handleDoneFlow = () => {
      resetUploaderState();
      onChange({ files: [...uploadedFiles] });
      setUploadedFiles([]);
    };

    ctxProviderRef.current?.addEventListener("done-flow", handleDoneFlow);

    return () => {
      ctxProviderRef.current?.removeEventListener("done-flow", handleDoneFlow);
    };
  }, [fileEntry, onChange, uploadedFiles, setUploadedFiles]);

  return (
    <UploaderWrapper>
      <lr-config
        ctx-name="Frontend-sm-app"
        pubkey="f7a7afe1c093cb1fd188"
        multiple={preview}
        confirmUpload={false}
        removeCopyright={true}
        imgOnly={true}
      ></lr-config>

      <lr-file-uploader-regular
        ctx-name="Frontend-sm-app"
        css-src={blocksStyles}
      ></lr-file-uploader-regular>

      <lr-upload-ctx-provider ctx-name="Frontend-sm-app" ref={ctxProviderRef} />

      {preview && (
        <PreviewGrid>
          {fileEntry.files.map((file) => (
            <PreviewContainer key={file.uuid}>
              <PreviewImage
                src={`${file.cdnUrl}/-/format/webp/-/quality/smart/-/stretch/fill/`}
                alt="preview"
              />
              <RemoveButtonContainer onClick={() => handleRemoveClick(file.uuid)}>
                <RemoveButton type="button">×</RemoveButton>
              </RemoveButtonContainer>
            </PreviewContainer>
          ))}
        </PreviewGrid>
      )}
    </UploaderWrapper>
  );
};

export default FileUploader;
