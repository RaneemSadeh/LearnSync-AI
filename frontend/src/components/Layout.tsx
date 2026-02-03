import React from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { ConsentModal } from './ConsentModal';
import { useTranslation } from 'react-i18next';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    // Ensure direction is set
    React.useEffect(() => {
        document.dir = isRTL ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
            <ConsentModal />
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 flex-1 w-full">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
};
