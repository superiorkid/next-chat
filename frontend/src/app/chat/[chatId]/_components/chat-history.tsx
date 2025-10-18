"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, X } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

// Type definitions
type FileType = "pdf" | "image" | "video" | "zip" | "other";

interface ChatFile {
  name: string;
  type: FileType;
  size: string;
  file?: File; // Only for newly uploaded files
}

interface ChatMessage {
  id: number;
  sender: "me" | "other";
  name?: string;
  message?: string;
  timestamp: string;
  avatar?: string;
  file?: ChatFile;
  files?: ChatFile[];
}

interface UploadedFile {
  file: File;
  name: string;
  type: FileType;
  size: string;
}

// Props for sub-components
interface FileIconProps {
  type: FileType;
  className?: string;
}

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

interface ChatMessageProps {
  message: ChatMessage;
}

// Dummy chat data with proper typing
const dummyMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "other",
    name: "Jacquenetta Slowgrave",
    message: "Hey there! How are you doing?",
    timestamp: "2:30 PM",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    sender: "me",
    message: "I'm good! Just working on some new features.",
    timestamp: "2:31 PM",
  },
  {
    id: 3,
    sender: "other",
    name: "Jacquenetta Slowgrave",
    message: "That sounds great! Can you review the design files I sent?",
    timestamp: "2:32 PM",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    sender: "me",
    message: "Sure, I'll take a look at them right away.",
    timestamp: "2:33 PM",
  },
  {
    id: 5,
    sender: "other",
    name: "Jacquenetta Slowgrave",
    message: "Thanks! Also, here's that document we discussed earlier.",
    timestamp: "2:35 PM",
    avatar: "https://github.com/shadcn.png",
    file: {
      name: "project-specs.pdf",
      type: "pdf",
      size: "2.4 MB",
    },
  },
  {
    id: 6,
    sender: "me",
    message: "Perfect! I've uploaded the images we need for the presentation.",
    timestamp: "2:40 PM",
    files: [
      {
        name: "design-mockup.png",
        type: "image",
        size: "1.2 MB",
      },
      {
        name: "assets.zip",
        type: "zip",
        size: "4.7 MB",
      },
    ],
  },
];

const FileIcon: React.FC<FileIconProps> = ({ type, className = "size-4" }) => {
  switch (type) {
    case "pdf":
      return <FileText className={className} />;
    case "image":
      return <Image className={className} />;
    case "video":
      return <Video className={className} />;
    default:
      return <FileText className={className} />;
  }
};

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
      <FileIcon type={file.type} className="size-4 text-blue-600" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 hover:bg-blue-100"
        onClick={onRemove}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <div className={`flex gap-3 mb-6 ${isMe ? "flex-row-reverse" : ""}`}>
      {!isMe && (
        <Avatar className="size-8">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback>{message.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[70%]`}
      >
        {message.message && (
          <div
            className={`rounded-lg px-4 py-2 ${
              isMe
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}
          >
            <p className="text-sm">{message.message}</p>
          </div>
        )}

        {/* Single file */}
        {message.file && (
          <div className="mt-2">
            <div className="flex items-center gap-2 bg-white border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <FileIcon
                type={message.file.type}
                className="size-5 text-gray-600"
              />
              <div>
                <p className="text-sm font-medium">{message.file.name}</p>
                <p className="text-xs text-gray-500">{message.file.size}</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-2">
                Download
              </Button>
            </div>
          </div>
        )}

        {/* Multiple files */}
        {message.files && (
          <div className="mt-2 space-y-2">
            {message.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <FileIcon type={file.type} className="size-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isMe && (
          <span className="text-xs mt-2 text-gray-500">
            {message.timestamp}
          </span>
        )}

        {isMe && (
          <span className="text-xs text-gray-500 mt-2">
            {message.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

// Utility function to get file type from MIME type
const getFileType = (mimeType: string): FileType => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-zip-compressed"
  )
    return "zip";
  return "other";
};

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      file,
      name: file.name,
      type: getFileType(file.type),
      size: formatFileSize(file.size),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (): void => {
    if (message.trim() || files.length > 0) {
      // Here you would typically send the message and files to your backend
      console.log("Sending message:", message);
      console.log("Files:", files);

      // Reset form
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-1 flex-1 p-4">
      {dummyMessages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

// Icon components with proper typing
interface IconProps {
  className?: string;
}

const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const EllipsisIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

export default ChatComponent;
