import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const FileUpload = ({
  accept = '.pdf,.doc,.docx,.hwp',
  maxSize = 10,
  multiple = false,
  onFilesSelected,
  disabled = false,
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`;
    }

    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        return file.type.match(type.replace('*', '.*'));
      })) {
        return `지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`;
      }
    }

    return null;
  };

  const handleFiles = async (files: FileList) => {
    const filesArray = Array.from(files);
    const newFiles: UploadedFile[] = [];

    for (const file of filesArray) {
      const error = validateFile(file);
      // eslint-disable-next-line react-hooks/purity
      const fileId = `${file.name}-${Date.now()}-${Math.random()}`;
      const uploadedFile: UploadedFile = {
        file,
        id: fileId,
        status: error ? 'error' : 'uploading',
        progress: 0,
        error: error || undefined,
      };

      newFiles.push(uploadedFile);

      if (!error) {
        // Simulate upload progress
        simulateUpload(uploadedFile.id);
      }
    }

    setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);

    // Notify parent of valid files
    const validFiles = newFiles.filter(f => !f.error).map(f => f.file);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, progress, status: progress === 100 ? 'success' : 'uploading' }
            : f
        )
      );
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />

        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isDragging ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 업로드'}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          지원 형식: {accept} (최대 {maxSize}MB)
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-shrink-0 mr-3">
                {uploadedFile.status === 'success' && (
                  <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {uploadedFile.status === 'error' && (
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                {uploadedFile.status === 'uploading' && (
                  <FiFile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.file.size)}
                </p>

                {uploadedFile.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-primary-600 dark:bg-primary-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadedFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {uploadedFile.error}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(uploadedFile.id);
                }}
                className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
