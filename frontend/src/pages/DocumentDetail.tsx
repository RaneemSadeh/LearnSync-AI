import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { MediaPlayer } from '../components/MediaPlayer';
import { TranscriptView } from '../components/TranscriptView';
import { QuizPlayer } from '../components/QuizPlayer';
import { FlashcardViewer } from '../components/FlashcardViewer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Sparkles, BookOpen, ArrowRight, ArrowLeft, PlayCircle, GraduationCap, BrainCircuit, Image as ImageIcon } from 'lucide-react';

interface Concept {
    term: string;
    definition: string;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correct_answer_index: number;
}

interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}

interface Flashcard {
    term: string;
    definition: string;
}

interface FlashcardDeck {
    id: number;
    title: string;
    cards: Flashcard[];
}

interface DocumentDetail {
    id: number;
    filename: string;
    extracted_text: string;
    media_type: 'pdf' | 'audio' | 'video' | 'image';
    file_path: string;
    summary: string | null;
    key_concepts: Concept[] | null;
    language: string;
}

export const DocumentDetail = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState<DocumentDetail | null>(null);
    const [loading, setLoading] = useState(false);

    // Tools State
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [flashcards, setFlashcards] = useState<FlashcardDeck | null>(null);
    const [activeTool, setActiveTool] = useState<'quiz' | 'flashcards' | null>(null);

    const [activeTab, setActiveTab] = useState<'text' | 'summary' | 'concepts' | 'transcript' | 'tools'>('summary');

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/documents/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const found = response.data.find((d: any) => d.id === Number(id));

            if (found) {
                if (typeof found.key_concepts === 'string') {
                    found.key_concepts = JSON.parse(found.key_concepts);
                }
                setDocument(found);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnalyze = async () => {
        if (!document) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/documents/${document.id}/analyze`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDocument(prev => prev ? {
                ...prev,
                summary: response.data.summary,
                key_concepts: response.data.key_concepts
            } : null);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!document) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/documents/${document.id}/quiz`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuiz(response.data);
            setActiveTool('quiz');
        } catch (error) {
            console.error("Quiz gen failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        if (!document) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/documents/${document.id}/flashcards`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlashcards(response.data);
            setActiveTool('flashcards');
        } catch (error) {
            console.error("Flashcard gen failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (!document) return <Layout><div>Loading...</div></Layout>;

    // If a tool is active, show full screen tool view
    if (activeTool === 'quiz' && quiz) {
        return (
            <Layout>
                <QuizPlayer
                    questions={quiz.questions}
                    title={quiz.title}
                    onClose={() => setActiveTool(null)}
                />
            </Layout>
        );
    }

    if (activeTool === 'flashcards' && flashcards) {
        return (
            <Layout>
                <FlashcardViewer
                    cards={flashcards.cards}
                    title={flashcards.title}
                    onClose={() => setActiveTool(null)}
                />
            </Layout>
        );
    }

    const isRTL = i18n.language === 'ar';
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
    const isMedia = document.media_type === 'audio' || document.media_type === 'video';
    const isImage = document.media_type === 'image';
    const mediaUrl = `http://localhost:8000/static/${document.filename}`;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                        <Button variant="ghost" onClick={() => navigate('/')} className="mb-2 pl-0 hover:bg-transparent">
                            <ArrowIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('dashboard.back_to_docs')}
                        </Button>
                        <h1 className="text-2xl font-bold font-arabic flex items-center gap-2">
                            {isMedia && <PlayCircle className="h-6 w-6 text-blue-500" />}
                            {isImage && <ImageIcon className="h-6 w-6 text-green-600" />}
                            {document.filename}
                        </h1>
                    </div>
                    {!document.summary && (
                        <Button onClick={handleAnalyze} isLoading={loading}>
                            <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('dashboard.analyze_button')}
                        </Button>
                    )}
                </div>

                {/* Media Player or Image Viewer */}
                {isMedia && (
                    <MediaPlayer url={mediaUrl} type={document.media_type as 'audio' | 'video'} />
                )}

                {isImage && (
                    <div className="w-full bg-gray-100 rounded-lg overflow-hidden my-4 text-center">
                        <img src={mediaUrl} alt="Document" className="max-h-[500px] mx-auto object-contain" />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`px-6 py-3 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('dashboard.summary_tab')}
                        </button>
                        <button
                            onClick={() => setActiveTab('concepts')}
                            className={`px-6 py-3 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'concepts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <BookOpen className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('dashboard.concepts_tab')}
                        </button>

                        {isMedia ? (
                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={`px-6 py-3 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'transcript' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('dashboard.transcript_tab')}
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`px-6 py-3 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('dashboard.original_text_tab')}
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('tools')}
                            className={`px-6 py-3 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 'tools' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <GraduationCap className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('dashboard.tools_tab')}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'summary' && (
                            <div className="prose max-w-none font-arabic leading-relaxed">
                                {document.summary ? (
                                    <p className="text-lg text-gray-800">{document.summary}</p>
                                ) : (
                                    <div className="text-center py-20 text-gray-500">
                                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>{t('dashboard.no_summary_yet')}</p>
                                        <Button onClick={handleAnalyze} variant="outline" className="mt-4">
                                            {t('dashboard.analyze_now')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'concepts' && (
                            <div className="grid gap-4">
                                {document.key_concepts ? (
                                    document.key_concepts.map((concept, idx) => (
                                        <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                                            <h3 className="font-bold text-blue-700 mb-1 font-arabic text-lg">{concept.term}</h3>
                                            <p className="text-gray-700 font-arabic">{concept.definition}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-gray-500">
                                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>{t('dashboard.no_concepts_yet')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'text' && (
                            <div className="p-4 bg-gray-50 rounded-lg h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                                {document.extracted_text}
                            </div>
                        )}

                        {activeTab === 'transcript' && (
                            <TranscriptView transcript={document.extracted_text} />
                        )}

                        {activeTab === 'tools' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                                        <GraduationCap className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold font-arabic mb-2">{t('dashboard.generate_quiz')}</h3>
                                    <p className="text-sm text-gray-600 mb-6">Generated personalized MCQs based on the content of this document.</p>
                                    <Button onClick={handleGenerateQuiz} isLoading={loading}>
                                        {t('dashboard.generate_quiz')}
                                    </Button>
                                </div>

                                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                                        <BrainCircuit className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold font-arabic mb-2">{t('dashboard.generate_cards')}</h3>
                                    <p className="text-sm text-gray-600 mb-6">Create spaced repetition flashcards for key terms and definitions.</p>
                                    <Button onClick={handleGenerateFlashcards} isLoading={loading} variant="secondary">
                                        {t('dashboard.generate_cards')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
