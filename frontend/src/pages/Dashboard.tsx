import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';
import { FileUpload } from '../components/FileUpload';
import { FileText, Calendar, Book, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Document {
    id: number;
    filename: string;
    upload_date: string;
    language: string;
    extracted_text: string;
}

interface Course {
    id: number;
    title: string;
}

export const Dashboard = () => {
    const { t } = useTranslation();
    const { courseId } = useParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Fetch Course Details
            const courseRes = await axios.get(`http://localhost:8000/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourse(courseRes.data);

            // Fetch Course Documents
            const docsRes = await axios.get(`http://localhost:8000/courses/${courseId}/documents`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(docsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            navigate('/'); // Redirect to courses if error
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchDocumentsOnly = async () => {
        const token = localStorage.getItem('token');
        try {
            const docsRes = await axios.get(`http://localhost:8000/courses/${courseId}/documents`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(docsRes.data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        }
    };

    return (
        <Layout>
            <div className="space-y-6 max-w-6xl mx-auto py-4">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                    {t('courses.back_to_courses')}
                </button>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Book className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-arabic">
                            {course?.title || t('dashboard.title')}
                        </h1>
                    </div>

                    <p className="text-gray-500 mb-8 max-w-2xl text-lg">
                        {t('dashboard.subtitle')}
                    </p>

                    <FileUpload
                        onUploadComplete={fetchDocumentsOnly}
                        courseId={courseId}
                    />
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 font-arabic border-b border-gray-100 pb-4">
                        {t('dashboard.my_documents')}
                    </h2>

                    {documents.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                            <div className="p-4 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <FileText className="h-8 w-8 text-gray-200" />
                            </div>
                            <p className="text-lg">{t('dashboard.no_docs')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => navigate(`/documents/${doc.id}`)}
                                    className="group border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer bg-white relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${doc.language === 'ar' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                            }`}>
                                            {doc.language.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors" title={doc.filename}>
                                        {doc.filename}
                                    </h3>
                                    <div className="mt-4 flex items-center text-xs text-gray-400">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                                        <span>{new Date(doc.upload_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
