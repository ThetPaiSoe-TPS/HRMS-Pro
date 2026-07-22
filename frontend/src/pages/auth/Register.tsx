import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, type RegisterFormData } from '../../validations/auth.validation';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <AuthLayout title="Registration successful" showLogo={false}>
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100">
            <CheckBadgeIcon className="h-10 w-10 text-success-600" />
          </div>
          <h3 className="mt-4 text-h3 text-text-primary">Account created!</h3>
          <p className="mt-2 text-body text-text-secondary">
            Your account has been created successfully. You will be redirected to login.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your HR operations efficiently"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-input bg-danger-50 p-3 border border-danger-200">
            <p className="text-small text-danger-700">{error}</p>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<UserIcon className="h-5 w-5" />}
          error={errors.name?.message}
          touched={!!touchedFields.name}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          error={errors.email?.message}
          touched={!!touchedFields.email}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-tertiary hover:text-text-secondary focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          error={errors.password?.message}
          touched={!!touchedFields.password}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-text-tertiary hover:text-text-secondary focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          error={errors.password_confirmation?.message}
          touched={!!touchedFields.password_confirmation}
          {...register('password_confirmation')}
        />

        {/* Password strength indicator */}
        {password && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary-200 rounded-full overflow-hidden">
                <div 
                  className={`
                    h-full transition-all duration-300
                    ${password.length >= 8 ? 'bg-success-500' : password.length >= 6 ? 'bg-warning-500' : 'bg-danger-500'}
                    ${password.length >= 8 ? 'w-full' : password.length >= 6 ? 'w-3/4' : password.length >= 4 ? 'w-1/2' : 'w-1/4'}
                  `}
                />
              </div>
              <span className="text-xs text-text-tertiary">
                {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Medium' : 'Weak'}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-tertiary">
              <span className={password.length >= 8 ? 'text-success-600' : ''}>✓ 8+ characters</span>
              <span className={/[A-Z]/.test(password) ? 'text-success-600' : ''}>✓ Uppercase</span>
              <span className={/[a-z]/.test(password) ? 'text-success-600' : ''}>✓ Lowercase</span>
              <span className={/[0-9]/.test(password) ? 'text-success-600' : ''}>✓ Number</span>
              <span className={/[^A-Za-z0-9]/.test(password) ? 'text-success-600' : ''}>✓ Special character</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          size="lg"
        >
          Create Account
        </Button>

        <div className="text-small text-center">
          <span className="text-text-secondary">Already have an account?</span>{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};