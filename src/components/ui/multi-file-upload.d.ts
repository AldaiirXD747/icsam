
export interface FileWithPreview extends File {
  preview: string;
  name: string;
}

export interface MultiFileUploadProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const MultiFileUpload: React.FC<MultiFileUploadProps>;
