import { lazy, Suspense } from 'react';

const DocumentDetailLazy = lazy(() => import('./DocumentDetail').then(module => ({ default: module.DocumentDetail })));

export const DocumentDetail = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DocumentDetailLazy />
        </Suspense>
    );
};
