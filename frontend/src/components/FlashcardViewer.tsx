import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';

interface Flashcard {
    term: string;
    definition: string;
}

interface FlashcardViewerProps {
    cards: Flashcard[];
    title: string;
    onClose: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ cards, title, onClose }) => {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
        }
    };

    // Determine icon direction based on language
    const isRTL = i18n.language === 'ar';
    const NextIcon = isRTL ? ArrowLeft : ArrowRight;
    const PrevIcon = isRTL ? ArrowRight : ArrowLeft;

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-arabic">{title}</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>X</Button>
            </div>

            <div
                className="perspective-1000 h-64 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white border-2 border-blue-100 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
                        <span className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-4">{t('dashboard.question')} / {t('dashboard.flip_card')}</span>
                        <h3 className="text-2xl font-bold text-gray-800 font-arabic">{cards[currentIndex].term}</h3>
                        <RotateCw className="h-5 w-5 text-gray-300 absolute bottom-4 right-4" />
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center rotate-y-180">
                        <span className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-4">{t('dashboard.submit_answer')} / {t('dashboard.flip_card')}</span>
                        <p className="text-lg text-gray-700 font-arabic leading-relaxed">{cards[currentIndex].definition}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <PrevIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('dashboard.previous')}
                </Button>

                <span className="text-sm font-mono text-gray-500">
                    {currentIndex + 1} / {cards.length}
                </span>

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                >
                    {t('dashboard.next')}
                    <NextIcon className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                </Button>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                /* RTL Flip correction if needed, usually Y rotation works same */
            `}</style>
        </div>
    );
};
