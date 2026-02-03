import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Layout } from '../components/Layout';

export const Register = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth_messages.password_mismatch'));
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/auth/register', {
                email: formData.email,
                full_name: formData.fullName,
                password: formData.password,
                preferred_language: i18n.language
            });

            console.log('Registration successful:', response.data);
            alert(t('auth_messages.registration_success') || 'Registration successful! Please login.');

            // Redirect to login page
            navigate('/login');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.detail || t('auth_messages.registration_failed') || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex min-h-[80vh] items-center justify-center">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-arabic">
                            {t('auth.create_account')}
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <Input
                                name="fullName"
                                label={t('auth.full_name')}
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="email"
                                label={t('auth.email')}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="password"
                                label={t('auth.password')}
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="confirmPassword"
                                label={t('auth.confirm_password')}
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Registering...' : t('auth.register')}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">{t('auth.has_account')} </span>
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                                {t('auth.login_now')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
