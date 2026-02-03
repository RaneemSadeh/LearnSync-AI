
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <Button variant="ghost" onClick={toggleLanguage} className="flex gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-bold">{i18n.language === 'en' ? 'Arabic' : 'English'}</span>
        </Button>
    );
};
