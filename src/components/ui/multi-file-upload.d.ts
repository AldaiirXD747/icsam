
import React from 'react';

export interface FileWithPreview extends File {
  preview: string;
  name: string;
}

export interface MultiFileUploadProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  maxSizeError?: string;
  uploadAreaLabel?: string;
  noFilesMessage?: string;
}

export const MultiFileUpload: React.FC<MultiFileUploadProps>;
