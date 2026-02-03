import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';
import { Book, Plus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Course {
    id: number;
    title: string;
    created_at: string;
}

export const Courses = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<Course[]>([]);
    const [newCourseName, setNewCourseName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/courses/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Attempting to create course:", newCourseName); // Debug log

        if (!newCourseName.trim()) {
            console.warn("Course name is empty");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, redirecting to login");
            navigate('/login');
            return;
        }

        try {
            console.log("Sending request to backend...");
            const response = await axios.post('http://localhost:8000/courses/',
                { title: newCourseName },
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 5000 // 5s timeout to prevent hanging
                }
            );
            console.log("Course created successfully:", response.data);
            setNewCourseName('');
            await fetchCourses(); // Refresh list
        } catch (error: any) {
            console.error("Failed to create course:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);

                if (error.response.status === 401) {
                    alert("Session expired. Please log in again.");
                    navigate('/login');
                    return;
                }

                alert(`Error: ${error.response.data.detail || "Failed to create course"}`);
            } else if (error.request) {
                console.error("No response received (Network Error)");
                alert("Network Error: Backend is not responding. Please check if the server is running.");
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <Layout>
            <div className="space-y-8 max-w-6xl mx-auto py-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
                            {t('courses.title')}
                        </h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            {t('courses.subtitle')}
                        </p>

                        <form onSubmit={handleCreateCourse} className="flex gap-3 items-end">
                            <div className="flex-1">
                                <Input
                                    value={newCourseName}
                                    onChange={(e) => setNewCourseName(e.target.value)}
                                    placeholder={t('courses.name_placeholder')}
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="h-10 px-6">
                                <Plus className="h-5 w-5 mr-1 rtl:ml-1 rtl:mr-0" />
                                {t('courses.create_button')}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center text-gray-500">
                            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <Book className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-xl font-medium mb-1">{t('courses.no_courses')}</p>
                            <p className="text-gray-400">{t('courses.create_new')}</p>
                        </div>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Book className="h-8 w-8" />
                                    </div>
                                    <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 truncate group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-400">
                                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};
