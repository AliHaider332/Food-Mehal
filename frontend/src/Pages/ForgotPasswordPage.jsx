import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowLeft,
  HiOutlineKey,
  HiOutlineDeviceMobile,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';
import '../App.css';
import { axiosInstance } from '../Config/axios';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setForgotPasswordPage, setUser } from '../Store/auth/auth.slice';
import { Link, useNavigate } from 'react-router-dom';

// Validation Schemas
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const otpInputs = Array(6).fill(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: Email Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, touchedFields: emailTouched },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  // Step 2: OTP Form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValueForm,
    formState: { errors: otpErrors, touchedFields: otpTouched },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  // Step 3: Reset Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, touchedFields: passwordTouched },
    watch: watchPassword,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpValue];
      newOtp[index] = value;
      setOtpValue(newOtp);
      setOtpValueForm('otp', newOtp.join(''));

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtpValue(otpArray);
      setOtpValueForm('otp', pastedData);
      // Blur all inputs
      document.activeElement.blur();
    }
  };

  // Handle Email Submission
  const onEmailSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', {
        email: data.email,
      });

      setUserEmail(data.email);
      toast.success(res.data.message || 'OTP sent successfully!');
      startTimer();
      setStep(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to send OTP';
        toast.error(message);
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP Verification
  const onOtpSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/verify-otp', {
        email: userEmail,
        otp: data.otp,
      });

      toast.success(res.data.message || 'OTP verified successfully!');
      setTimer(0);
      setCanResend(false);
      setStep(3);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Invalid or expired OTP';
        toast.error(message);
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset
  const onPasswordReset = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/reset-password', {
        email: userEmail,
        password: data.newPassword,
      });

      toast.success(res.data.message || 'Password reset successfully!');
      dispatch(setForgotPasswordPage(false));
      dispatch(setUser(res.data?.data));
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Failed to reset password';
        toast.error(message);
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) {
      toast.info(`Please wait ${timer} seconds before requesting again`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', {
        email: userEmail,
      });

      toast.success(res.data.message || 'OTP resent successfully');
      startTimer();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to resend OTP';
        toast.error(message);
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setTimer(0);
    setCanResend(false);
    setUserEmail('');
    setOtpValue(['', '', '', '', '', '']);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, color: 'bg-gray-200', text: '' };
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { level: 100, color: 'bg-orange-500', text: 'Strong' };
    }
    if (password.length >= 8) {
      return { level: 66, color: 'bg-orange-400', text: 'Medium' };
    }
    return { level: 33, color: 'bg-orange-300', text: 'Weak' };
  };

  const passwordStrength = getPasswordStrength(watchPassword('newPassword'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlineKey className="text-3xl text-orange-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {step === 1 && 'Forgot Password?'}
                {step === 2 && 'Verify OTP'}
                {step === 3 && 'Reset Password'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {step === 1 && "Don't worry, we'll send you reset instructions"}
                {step === 2 && `Enter the 6-digit code sent to ${userEmail}`}
                {step === 3 && 'Create a new strong password'}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex-1 relative">
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          step >= num
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step > num ? (
                          <HiOutlineCheckCircle className="text-lg" />
                        ) : (
                          num
                        )}
                      </div>
                    </div>
                    {num < 3 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${
                          step > num ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Email</span>
                <span>OTP</span>
                <span>Reset</span>
              </div>
            </div>

            {/* Step 1: Email Form */}
            {step === 1 && (
              <form
                onSubmit={handleEmailSubmit(onEmailSubmit)}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    <input
                      type="email"
                      {...registerEmail('email')}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                        emailErrors.email && emailTouched.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="alihaider@gmail.com"
                      aria-label="Email address"
                    />
                  </div>
                  {emailErrors.email && emailTouched.email && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 transform ${
                    !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    to="/signin"
                    onClick={() => dispatch(setForgotPasswordPage(false))}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors hover:underline inline-flex items-center gap-1"
                  >
                    <HiOutlineArrowLeft className="text-sm" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form
                onSubmit={handleOtpSubmit(onOtpSubmit)}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Verification Code <span className="text-red-500">*</span>
                  </label>

                  {/* OTP Input Fields */}
                  <div
                    className="flex gap-2 justify-center mb-4"
                    onPaste={handleOtpPaste}
                  >
                    {otpInputs.map((_, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={otpValue[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                          otpErrors.otp && otpTouched.otp
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="•"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  <input type="hidden" {...registerOtp('otp')} />

                  {otpErrors.otp && otpTouched.otp && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {otpErrors.otp.message}
                    </p>
                  )}

                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      <HiOutlineShieldCheck className="text-sm" />
                      OTP sent to {userEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 transform ${
                    !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <HiOutlineArrowLeft className="text-sm" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || isSubmitting}
                    className={`text-sm font-medium transition-all duration-200 inline-flex items-center gap-2 ${
                      canResend && !isSubmitting
                        ? 'text-orange-500 hover:text-orange-600 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {timer > 0 && (
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold">
                        {Math.floor(timer / 60)}:
                        {String(timer % 60).padStart(2, '0')}
                      </span>
                    )}
                    <HiOutlineRefresh className="text-sm" />
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form
                onSubmit={handlePasswordSubmit(onPasswordReset)}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('newPassword')}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                        passwordErrors.newPassword &&
                        passwordTouched.newPassword
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Create new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={
                        showNewPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showNewPassword ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword &&
                    passwordTouched.newPassword && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {passwordErrors.newPassword.message}
                      </p>
                    )}

                  {/* Password Strength Indicator */}
                  {watchPassword('newPassword') &&
                    !passwordErrors.newPassword && (
                      <div className="mt-3 space-y-1.5 animate-fadeIn">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.level}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Password strength:{' '}
                          <span
                            className={`font-semibold ${passwordStrength.textColor}`}
                          >
                            {passwordStrength.text}
                          </span>
                        </p>
                      </div>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('confirmPassword')}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                        passwordErrors.confirmPassword &&
                        passwordTouched.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword &&
                    passwordTouched.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 animate-fadeIn">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <HiOutlineShieldCheck className="text-orange-500 text-sm" />
                    Password must contain at least 8 characters, including
                    uppercase, lowercase, and numbers
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 transform ${
                    !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Resetting Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors inline-flex items-center justify-center gap-1"
                >
                  <HiOutlineArrowLeft className="text-sm" />
                  Back to OTP
                </button>
              </form>
            )}

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 pt-6 mt-4 border-t border-gray-100">
              <HiOutlineShieldCheck className="text-green-500 text-sm" />
              <p className="text-xs text-gray-400">
                🔒 Secure password reset with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      
      .animate-slideDown {
        animation: slideDown 0.3s ease-out;
      }
      
      /* Prevent zoom on iOS for form inputs */
      @media (max-width: 640px) {
        input, 
        button {
          font-size: 16px !important;
        }
      }
    `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
