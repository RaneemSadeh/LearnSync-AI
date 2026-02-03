import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correct_answer_index: number;
}

interface QuizPlayerProps {
    questions: Question[];
    title: string;
    onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, title, onClose }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === questions[currentIndex].correct_answer_index;
        if (isCorrect) setScore(score + 1);
        setShowResult(true);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelectedOption(null);
                setShowResult(false);
            } else {
                setIsCompleted(true);
            }
        }, 1500);
    };

    if (isCompleted) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold font-arabic mb-4">{t('dashboard.completion_message')}</h2>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score} / {questions.length}
                </div>
                <p className="text-gray-500 mb-6 font-arabic">{t('dashboard.score')}</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={onClose} variant="outline">{t('dashboard.back_to_docs')}</Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold font-arabic">{title}</h2>
                <span className="text-sm text-gray-500 font-mono">
                    {currentIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 font-arabic leading-relaxed">{currentQuestion.question}</h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let buttonClass = "w-full text-right p-4 rounded-lg border transition-all text-sm font-arabic hover:bg-gray-50 flex justify-between items-center";

                        if (selectedOption === idx) {
                            buttonClass += " border-blue-500 ring-1 ring-blue-500 bg-blue-50";
                        }

                        if (showResult) {
                            if (idx === currentQuestion.correct_answer_index) {
                                buttonClass = "w-full text-right p-4 rounded-lg border bg-green-50 border-green-500 text-green-700 font-bold flex justify-between items-center";
                            } else if (selectedOption === idx) {
                                buttonClass = "w-full text-right p-4 rounded-lg border bg-red-50 border-red-500 text-red-700 flex justify-between items-center";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                className={buttonClass}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={showResult}
                            >
                                <span>{option}</span>
                                {showResult && idx === currentQuestion.correct_answer_index && <CheckCircle className="h-5 w-5 text-green-600" />}
                                {showResult && selectedOption === idx && idx !== currentQuestion.correct_answer_index && <XCircle className="h-5 w-5 text-red-600" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={selectedOption === null || showResult}>
                    {t('dashboard.submit_answer')}
                </Button>
            </div>
        </div>
    );
};
