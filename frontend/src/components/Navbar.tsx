
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-blue-600 font-arabic">LearnSync AI</h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex space-x-4 rtl:space-x-reverse">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                {t('auth.login')}
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                                {t('auth.register')}
                            </Link>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};
