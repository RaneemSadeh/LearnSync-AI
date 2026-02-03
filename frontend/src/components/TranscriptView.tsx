import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

interface TranscriptViewProps {
    transcript: string;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
    const { t } = useTranslation();

    if (!transcript) {
        return (
            <div className="text-center py-10 text-gray-500">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                {t('dashboard.no_transcript')}
            </div>
        )
    }

    // Basic parsing of timestamped mock format [00:00:00] Text
    const lines = transcript.split('\n').filter(line => line.trim());

    return (
        <div className="space-y-2 h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            {lines.map((line, index) => {
                // Simple regex to separate timestamp and text if present
                const match = line.match(/^(\[\d{2}:\d{2}:\d{2}\])\s*(.+)$/);

                if (match) {
                    return (
                        <div key={index} className="flex gap-3 hover:bg-blue-50 p-2 rounded transition-colors group">
                            <span className="text-blue-600 font-mono text-sm shrink-0 select-none cursor-pointer hover:underline opacity-70 group-hover:opacity-100">
                                {match[1]}
                            </span>
                            <p className="text-gray-800 font-arabic text-base leading-relaxed">
                                {match[2]}
                            </p>
                        </div>
                    );
                }

                return (
                    <p key={index} className="text-gray-800 font-arabic leading-relaxed p-2">{line}</p>
                );
            })}
        </div>
    );
};
