import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, LogOut, Settings, Plus, GraduationCap } from 'lucide-react';
import { Button } from './ui/Button';

export const BottomNav = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <LayoutDashboard className="h-6 w-6" />
                    <span className="text-[10px] font-medium">{t('dashboard.my_documents')}</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 opacity-50 cursor-not-allowed`}
                    title="Coming soon"
                >
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-[10px] font-medium">{t('dashboard.tools_tab')}</span>
                </button>

                <div className="relative -top-5">
                    <Button
                        onClick={() => document.getElementById('file-upload-trigger')?.click()}
                        className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700 p-0"
                    >
                        <Plus className="h-8 w-8 text-white" />
                    </Button>
                </div>

                <button
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 opacity-50 cursor-not-allowed`}
                >
                    <Settings className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>

                <button
                    onClick={handleLogout}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500`}
                >
                    <LogOut className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};
