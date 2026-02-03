import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <p className="font-arabic">{t('legal.footer_copyright')}</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-blue-600 font-arabic transition-colors">{t('legal.privacy')}</a>
                    <a href="#" className="hover:text-blue-600 font-arabic transition-colors">{t('legal.terms')}</a>
                </div>
            </div>
        </footer>
    );
};
