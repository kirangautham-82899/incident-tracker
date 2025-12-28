import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, isLoading } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);

        if (result.success) {
            toast.success('Login successful!');
            onClose();
        } else {
            toast.error(result.error || 'Login failed');
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                >
                    <LogIn className="w-4 h-4" />
                    Login
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
