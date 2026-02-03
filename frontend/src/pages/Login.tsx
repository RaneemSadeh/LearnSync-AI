import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Layout } from '../components/Layout';

export const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // FastAPI OAuth2 expects form data
            const formData = new FormData();
            formData.append('username', email); // OAuth2 uses 'username' field
            formData.append('password', password);

            const response = await axios.post('http://localhost:8000/auth/token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('Login successful:', response.data);

            // Store token
            localStorage.setItem('token', response.data.access_token);

            // Redirect to dashboard
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
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
                            {t('auth.welcome_back')}
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
                                label={t('auth.email')}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label={t('auth.password')}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : t('auth.login')}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">{t('auth.no_account')} </span>
                            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                                {t('auth.register_now')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
