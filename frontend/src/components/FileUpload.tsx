import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Upload, FileText, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
    onUploadComplete: () => void;
    courseId?: string | number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, courseId }) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        const validTypes = ['application/pdf', 'audio/mpeg', 'audio/wav', 'video/mp4', 'image/jpeg', 'image/png'];

        const isValidType = validTypes.includes(file.type) ||
            file.name.endsWith('.mp3') ||
            file.name.endsWith('.wav') ||
            file.name.endsWith('.mp4') ||
            file.name.endsWith('.jpg') ||
            file.name.endsWith('.jpeg') ||
            file.name.endsWith('.png');

        if (!isValidType) {
            setMessage({ type: 'error', text: t('dashboard.invalid_file_type') });
            return;
        }
        setFile(file);
        setMessage(null);
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);
        if (courseId) {
            formData.append('course_id', courseId.toString());
        }

        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:8000/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: t('dashboard.upload_success') });
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onUploadComplete();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: t('dashboard.upload_error') });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {t('dashboard.drag_drop_text')}
                        </p>
                        <p className="text-xs text-gray-500">
                            {t('dashboard.or')}
                        </p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.mp3,.wav,.mp4,.jpg,.jpeg,.png"
                        className="hidden"
                    />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {t('dashboard.browse_files')}
                    </Button>
                </div>
            </div>

            {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {file.type.startsWith('image') ? <ImageIcon className="h-5 w-5 text-gray-500" /> : <FileText className="h-5 w-5 text-gray-500" />}
                        <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
                    </div>
                    <Button
                        size="sm"
                        onClick={uploadFile}
                        isLoading={uploading}
                        disabled={uploading}
                    >
                        {t('dashboard.upload_button')}
                    </Button>
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}
        </div>
    );
};
