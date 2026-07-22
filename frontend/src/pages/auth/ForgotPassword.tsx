import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../validations/auth.validation';
import { authApi } from '../../api/auth/authApi';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" showLogo={false}>
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100">
            <CheckBadgeIcon className="h-10 w-10 text-success-600" />
          </div>
          <h3 className="mt-4 text-h3 text-text-primary">Reset link sent!</h3>
          <p className="mt-2 text-body text-text-secondary">
            We've sent a password reset link to your email address. 
            Please check your inbox and follow the instructions.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => window.location.href = '/login'}
          >
            Back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
      showLogo={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-input bg-danger-50 p-3 border border-danger-200">
            <p className="text-small text-danger-700">{error}</p>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          error={errors.email?.message}
          touched={!!touchedFields.email}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          size="lg"
        >
          Send Reset Link
        </Button>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Back to Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};