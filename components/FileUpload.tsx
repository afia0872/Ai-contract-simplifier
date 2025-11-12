import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onSummarize: (content: string | File) => void;
  initialText: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSummarize, initialText }) => {
  const [text, setText] = useState(initialText);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        // Provide visual feedback in the textarea that a file is selected
        setText(`File selected: ${selectedFile.name}\n\nClick "Simplify Contract" to analyze.`);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      // If user starts typing, we assume they don't want to use the file anymore
      if (file) {
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
          }
      }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSummarize(file);
    } else {
      onSummarize(text);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg transition-shadow hover:shadow-xl">
      <form onSubmit={handleSubmit}>
        <label htmlFor="contract-text" className="block text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">
          Paste Contract Text or Upload a File
        </label>
        <textarea
          id="contract-text"
          value={text}
          onChange={handleTextChange}
          placeholder="Paste the full text of your legal document here..."
          className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:text-slate-200"
          required={!file} // Text is not required if a file is selected
        ></textarea>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
          <p><strong>Privacy Notice:</strong> This is a demonstration tool. Documents are processed by our secure backend. Please do not upload contracts with highly sensitive personal or financial information.</p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="px-4 py-2 border border-slate-300 dark:border-slate-500 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Upload File (.txt, .pdf, .doc, .docx)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all transform hover:scale-105"
          >
            Simplify Contract
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;