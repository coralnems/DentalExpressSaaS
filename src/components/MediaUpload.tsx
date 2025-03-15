'use client';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type MediaUploadProps = {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
};

export default function MediaUpload({
  onUpload,
  maxFiles = 5,
  acceptedFileTypes = ['image/*', 'video/*'],
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>(
    {},
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const newProgress: { [key: string]: number } = {};
      acceptedFiles.forEach((file) => {
        newProgress[file.name] = 0;
      });
      setUploadProgress(newProgress);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          let allComplete = true;
          Object.keys(updated).forEach((fileName) => {
            if (updated[fileName] < 100) {
              updated[fileName] += 10;
              allComplete = false;
            }
          });
          if (allComplete) {
            clearInterval(interval);
            setUploading(false);
          }
          return updated;
        });
      }, 500);

      // Call the onUpload callback
      onUpload(acceptedFiles);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {},
    ),
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          {isDragActive
            ? (
                <p className="text-indigo-500">Drop the files here...</p>
              )
            : (
                <>
                  <p className="text-gray-500">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports images and videos up to 10MB
                  </p>
                </>
              )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{fileName}</span>
                <span className="text-gray-500">
                  {progress}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
