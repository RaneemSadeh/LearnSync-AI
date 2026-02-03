import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    welcome: "Welcome to LearnSync AI",
                    toggle_lang: "عربي",
                    auth: {
                        login: "Log In",
                        register: "Register",
                        email: "Email Address",
                        password: "Password",
                        confirm_password: "Confirm Password",
                        full_name: "Full Name",
                        welcome_back: "Welcome Back",
                        create_account: "Create Account",
                        no_account: "Don't have an account?",
                        register_now: "Register now",
                        has_account: "Already have an account?",
                        login_now: "Log in"
                    },
                    dashboard: {
                        title: "Upload Materials",
                        subtitle: "Upload your PDFs (Arabic or English) to generate summaries and quizzes.",
                        my_documents: "My Documents",
                        no_docs: "No documents uploaded yet.",
                        drag_drop_text: "Drag and drop your PDF here",
                        or: "OR",
                        browse_files: "Browse Files",
                        upload_button: "Upload File",
                        invalid_file_type: "Please upload a PDF file",
                        upload_success: "File uploaded successfully!",
                        upload_error: "Error uploading file.",
                        analyze_button: "Analyze Document",
                        summary_tab: "AI Summary",
                        concepts_tab: "Key Concepts",
                        original_text_tab: "Extracted Text",
                        no_summary_yet: "No summary generated yet.",
                        analyze_now: "Generate Summary",
                        no_concepts_yet: "No concepts extracted.",
                        back_to_docs: "Back to Documents",
                        media_player: "Media Player",
                        transcript_tab: "Transcript",
                        no_transcript: "No transcript available.",
                        tools_tab: "Study Tools",
                        generate_quiz: "Generate Quiz",
                        generate_cards: "Generate Flashcards",
                        take_quiz: "Take Quiz",
                        view_cards: "View Flashcards",
                        question: "Question",
                        submit_answer: "Submit",
                        next_question: "Next",
                        score: "Your Score",
                        flip_card: "Flip Card",
                        previous: "Previous",
                        next: "Next",
                        completion_message: "Quiz Completed!",
                        retry: "Retry Quiz"
                    },
                    courses: {
                        title: "My Courses",
                        subtitle: "Organize your study materials by course.",
                        create_new: "Create New Course",
                        name_placeholder: "e.g. Data Mining Course",
                        create_button: "Create Course",
                        no_courses: "No courses created yet.",
                        view_course: "View Materials",
                        back_to_courses: "Back to Courses"
                    },
                    legal: {
                        consent_title: "Terms of Service",
                        consent_text: "By using LearnSync AI, you agree to our Terms of Service and Privacy Policy. We process your uploaded documents to provide educational insights.",
                        i_agree: "I Agree",
                        footer_copyright: "© 2026 LearnSync AI. All rights reserved.",
                        privacy: "Privacy Policy",
                        terms: "Terms of Service"
                    },
                    auth_messages: {
                        password_mismatch: "Passwords do not match",
                        registration_success: "Registration successful! Please login.",
                        registration_failed: "Registration failed. Please try again."
                    }
                }
            },
            ar: {
                translation: {
                    welcome: "أهلاً بك في LearnSync AI",
                    toggle_lang: "English",
                    auth: {
                        login: "تسجيل الدخول",
                        register: "إنشاء حساب",
                        email: "البريد الإلكتروني",
                        password: "كلمة المرور",
                        confirm_password: "تأكيد كلمة المرور",
                        full_name: "الاسم الكامل",
                        welcome_back: "مرحباً بعودتك",
                        create_account: "إنشاء حساب جديد",
                        no_account: "ليس لديك حساب؟",
                        register_now: "سجل الآن",
                        has_account: "لديك حساب بالفعل؟",
                        login_now: "سجل دخولك"
                    },
                    dashboard: {
                        title: "رفع المواد الدراسية",
                        subtitle: "قم برفع ملفات PDF (بالعربية أو الإنجليزية) لإنشاء الملخصات والاختبارات.",
                        my_documents: "مستنداتي",
                        no_docs: "لم يتم رفع أي مستندات بعد.",
                        drag_drop_text: "اسحب وأفلت ملف PDF هنا",
                        or: "أو",
                        browse_files: "استعراض الملفات",
                        upload_button: "رفع الملف",
                        invalid_file_type: "يرجى رفع ملف بصيغة PDF",
                        upload_success: "تم رفع الملف بنجاح!",
                        upload_error: "حدث خطأ أثناء رفع الملف.",
                        analyze_button: "تحليل المستند",
                        summary_tab: "الملخص الذكي",
                        concepts_tab: "المفاهيم الأساسية",
                        original_text_tab: "النص الأصلي",
                        no_summary_yet: "لم يتم إنشاء ملخص بعد.",
                        analyze_now: "إنشاء ملخص",
                        no_concepts_yet: "لم يتم استخراج مفاهيم بعد.",
                        back_to_docs: "عودة للمستندات",
                        media_player: "مشغل الوسائط",
                        transcript_tab: "النص المفرغ",
                        no_transcript: "لا يوجد نص مفرغ متاح.",
                        tools_tab: "أدوات الدراسة",
                        generate_quiz: "إنشاء اختبار",
                        generate_cards: "إنشاء بطاقات ذاكرة",
                        take_quiz: "بدء الاختبار",
                        view_cards: "عرض البطاقات",
                        question: "سؤال",
                        submit_answer: "إجابة",
                        next_question: "التالي",
                        score: "نتيجتك",
                        flip_card: "اقلب البطاقة",
                        previous: "السابق",
                        next: "التالي",
                        completion_message: "أتممت الاختبار!",
                        retry: "إعادة المحاولة"
                    },
                    courses: {
                        title: "مساقاتي الدراسية",
                        subtitle: "قم بتنظيم موادك الدراسية حسب المساق.",
                        create_new: "إنشاء مساق جديد",
                        name_placeholder: "مثال: مساق تنقيب البيانات",
                        create_button: "إنشاء مساق",
                        no_courses: "لم يتم إنشاء مساقات بعد.",
                        view_course: "عرض المواد",
                        back_to_courses: "العودة للمساقات"
                    },
                    legal: {
                        consent_title: "شروط الخدمة",
                        consent_text: "باستخدامك لمنصة LearnSync AI، فإنك توافق على شروط الخدمة وسياسة الخصوصية. نقوم بمعالجة مستنداتك لتقديم رؤى تعليمية.",
                        i_agree: "أوافق",
                        footer_copyright: "© ٢٠٢٦ LearnSync AI. جميع الحقوق محفوظة.",
                        privacy: "سياسة الخصوصية",
                        terms: "شروط الخدمة"
                    },
                    auth_messages: {
                        password_mismatch: "كلمات المرور غير متطابقة",
                        registration_success: "تم التسجيل بنجاح! يرجى تسجيل الدخول.",
                        registration_failed: "فشل التسجيل. يرجى المحاولة مرة أخرى."
                    }
                }
            }
        }
    });

export default i18n;
