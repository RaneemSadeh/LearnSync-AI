import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { ShieldCheck } from 'lucide-react';

export const ConsentModal = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem('legal_consent');
        if (!hasConsented) {
            setIsOpen(true);
        }
    }, []);

    const handleAgree = () => {
        localStorage.setItem('legal_consent', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold font-arabic mb-2">{t('legal.consent_title')}</h2>
                    <p className="text-gray-600 font-arabic mb-6 leading-relaxed">
                        {t('legal.consent_text')}
                    </p>
                    <Button onClick={handleAgree} className="w-full">
                        {t('legal.i_agree')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
