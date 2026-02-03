import React from 'react';
import { useTranslation } from 'react-i18next';

interface MediaPlayerProps {
    url: string;
    type: 'audio' | 'video';
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, type }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-black rounded-lg overflow-hidden my-4">
            {type === 'video' ? (
                <video
                    controls
                    className="w-full h-auto max-h-[400px]"
                    src={url}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="p-4 flex flex-col items-center justify-center bg-gray-900 text-white min-h-[120px]">
                    <h3 className="mb-2 text-sm text-gray-300">{t('dashboard.media_player')}</h3>
                    <audio
                        controls
                        className="w-full max-w-md"
                        src={url}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};
