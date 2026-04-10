import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// --- 아이콘 컴포넌트 ---
const EyeIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z" fill="#4285F4" />
        <path d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z" fill="#34A853" />
        <path d="M3.52 9.52C3.36 9.04 3.26909 8.53091 3.26909 8C3.26909 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49818 0 6.71273 0 8C0 9.28727 0.312727 10.5018 0.858182 11.5927L3.52 9.52Z" fill="#FBBC05" />
        <path d="M8 3.18182C9.17455 3.18182 10.2255 3.58545 11.0545 4.37818L13.3527 2.08C11.9636 0.792727 10.1527 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18182 8 3.18182Z" fill="#EA4335" />
    </svg>
);

const ArrowBackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'check_email'>('signin');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [user_name, setUser_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetEmail, setResetEmail] = useState(''); // 비밀번호 초기화용 이메일 상태

    const [errorMsg, setErrorMsg] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const isSignIn = authMode === 'signin';
    const isSignUp = authMode === 'signup';

    useEffect(() => {
        if (submitAttempted && (isSignIn || isSignUp)) validate();
    }, [user_name, email, password, confirmPassword, authMode, submitAttempted]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (isSignUp || user_name.trim() !== '') {
            if (!user_name.trim()) {
                newErrors.user_name = "이름을 입력해주세요.";
            } else {
                const hasSpace = /\s/.test(user_name);
                const nameRegex = /^[a-zA-Z가-힣0-9]+$/;
                if (hasSpace) newErrors.user_name = "공백은 사용할 수 없습니다.";
                else if (!nameRegex.test(user_name)) newErrors.user_name = "특수문자는 사용할 수 없습니다.";
                else if (user_name.length < 2 || user_name.length > 10) newErrors.user_name = "2~10자 사이로 입력해주세요.";
            }
        }

        if (isSignUp) {
            if (!email.trim()) {
                newErrors.email = "이메일을 입력해주세요.";
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (/\s/.test(email)) newErrors.email = "공백을 포함할 수 없습니다.";
                else if (!emailRegex.test(email)) newErrors.email = "올바른 이메일 형식이 아닙니다.";
            }

            if (!password) {
                newErrors.password = "비밀번호를 입력해주세요.";
            } else {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(password)) newErrors.password = "8자 이상, 영문/숫자/특수문자 조합 필요";
            }

            if (password !== confirmPassword) {
                newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
            }
        } else if (isSignIn) {
            if (!password) newErrors.password = "비밀번호를 입력해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitAttempted(true);
        setErrorMsg('');

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (isSignIn) {
                await login(user_name, password);
                const from = (location.state as { from?: string } | null)?.from ?? '/plan';
                navigate(from, { replace: true });
            } else {
                await register(email, password, user_name);
                setAuthMode('signin');
            }
        } catch (err: any) {
            const apiData = err.response?.data;
            if (apiData) {
                const newFieldErrors: Record<string, string> = {};
                if (apiData.username) newFieldErrors.user_name = "이미 존재하는 사용자 이름입니다.";
                if (apiData.email) newFieldErrors.email = "이미 가입된 이메일입니다.";
                if (apiData.detail) setErrorMsg("정보가 일치하지 않습니다.");

                setErrors(prev => ({ ...prev, ...newFieldErrors }));
                if (apiData.message) setErrorMsg(apiData.message);
            } else {
                setErrorMsg('인증에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: 실제 이메일 전송 API 연결 필요
        console.log("Password reset requested for:", resetEmail);
        setAuthMode('check_email'); // 성공 후 이메일 확인 화면으로 전환
    };

    const handleModeSwitch = (mode: 'signin' | 'signup' | 'forgot' | 'check_email') => {
        setAuthMode(mode);
        setSubmitAttempted(false);
        setErrorMsg('');
        setErrors({});
    };

    return (
        <div className="flex h-[100dvh] w-full bg-white font-body text-black overflow-hidden">
            {/* 왼쪽 패널 */}
            <div className="flex-1 flex flex-col justify-between items-center py-8 px-6 relative w-full lg:max-w-[720px] overflow-y-auto">

                {/* 상단 로고 */}
                <div className="w-full flex items-center gap-2 self-start sm:pl-8 mb-6">
                    <div className="w-[29px] h-[29px] bg-black rounded-full" />
                    <p className="font-headline text-[#1d1d35] text-2xl tracking-normal">
                        <span className="font-bold">CA</span>
                        <span>BEAN</span>
                    </p>
                </div>

                {/* 메인 폼 영역: authMode에 따라 다른 컴포넌트 렌더링 */}
                <div className="w-full max-w-[360px] flex flex-col gap-5 mx-auto my-auto">

                    {/* --- 로그인 및 회원가입 화면 --- */}
                    {(isSignIn || isSignUp) && (
                        <>
                            <div className="flex flex-col gap-3">
                                <h1 className="font-headline font-bold text-4xl leading-tight">
                                    {isSignIn ? 'Welcome' : 'Create account'}
                                </h1>
                                <p className="text-[#00000073] text-sm">
                                    {isSignIn
                                        ? 'Welcome back! Please enter your details.'
                                        : 'Sign up for comprehensive trip planning'}
                                </p>
                            </div>

                            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5" noValidate>
                                {/* User Name */}
                                <div className="flex flex-col gap-1.5 relative">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-sm text-black font-medium">Username</label>
                                        {errors.user_name && <span className="text-[11px] text-red-500 font-bold">{errors.user_name}</span>}
                                    </div>
                                    <div className={`flex items-center px-4 py-2.5 rounded-lg border border-solid transition-colors ${errors.user_name ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#00000040] focus-within:border-black'}`}>
                                        <input
                                            type="text"
                                            value={user_name}
                                            onChange={(e) => setUser_name(e.target.value)}
                                            placeholder="Enter username"
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[#00000040]"
                                        />
                                    </div>
                                </div>

                                {/* Email (SignUp Only) */}
                                {isSignUp && (
                                    <div className="flex flex-col gap-1.5 relative">
                                        <div className="flex justify-between items-end px-1">
                                            <label className="text-sm text-black font-medium">Email</label>
                                            {errors.email && <span className="text-[11px] text-red-500 font-bold">{errors.email}</span>}
                                        </div>
                                        <div className={`flex items-center px-4 py-2.5 rounded-lg border border-solid transition-colors ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#00000040] focus-within:border-black'}`}>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter email address"
                                                className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[#00000040]"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password */}
                                <div className="flex flex-col gap-1.5 relative">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-sm text-black font-medium">Password</label>
                                        {errors.password && <span className="text-[11px] text-red-500 font-bold">{errors.password}</span>}
                                    </div>
                                    <div className={`flex items-center px-4 py-2.5 rounded-lg border border-solid transition-colors ${errors.password ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#00000040] focus-within:border-black'}`}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[#00000040] pr-8"
                                            autoComplete={isSignIn ? "current-password" : "new-password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 text-[#00000073] hover:text-black transition-colors"
                                        >
                                            {showPassword ? <EyeOffIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password (SignUp Only) */}
                                {isSignUp && (
                                    <div className="flex flex-col gap-1.5 relative">
                                        <div className="flex justify-between items-end px-1">
                                            <label className="text-sm text-black font-medium">Confirm Password</label>
                                            {errors.confirmPassword && <span className="text-[11px] text-red-500 font-bold">{errors.confirmPassword}</span>}
                                        </div>
                                        <div className={`flex items-center px-4 py-2.5 rounded-lg border border-solid transition-colors ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#00000040] focus-within:border-black'}`}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm password"
                                                className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[#00000040] pr-8"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 text-[#00000073] hover:text-black transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOffIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Remember me & Forgot Password (SignIn Only) */}
                                {isSignIn && (
                                    <div className="flex items-center justify-between -mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setRememberMe(!rememberMe)}
                                            className="flex items-center gap-2 text-sm text-[#00000073] transition-colors hover:text-black"
                                        >
                                            <div className={`w-4.5 h-4.5 rounded border border-[#00000040] flex items-center justify-center transition-colors ${rememberMe ? "bg-black border-black" : ""}`}>
                                                {rememberMe && (
                                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                )}
                                            </div>
                                            Remember me
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleModeSwitch('forgot')}
                                            className="font-label font-medium text-sm text-black hover:underline hover:text-gray-700 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                {errorMsg && (
                                    <p className="text-[13px] font-medium text-red-500 bg-red-50 rounded-lg px-4 py-2">
                                        {errorMsg}
                                    </p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white font-label font-bold text-sm py-3 rounded-lg mt-1 flex items-center justify-center transition-all hover:bg-gray-800 disabled:opacity-70 disabled:hover:bg-black"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                                    ) : (
                                        isSignIn ? 'Log In' : 'Sign Up'
                                    )}
                                </button>

                                {/* OR 구분선 */}
                                <div className="flex items-center gap-3 my-1 opacity-60">
                                    <div className="flex-1 h-px bg-[#00000020]"></div>
                                    <span className="text-[#00000073] text-[13px]">OR</span>
                                    <div className="flex-1 h-px bg-[#00000020]"></div>
                                </div>

                                {/* 구글 로그인 버튼 */}
                                <button
                                    type="button"
                                    className="w-full bg-white border border-[#00000040] rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                >
                                    <GoogleIcon />
                                    <span className="text-sm font-medium text-black">{isSignIn ? 'Log in with Google' : 'Sign up with Google'}</span>
                                </button>

                                {/* 모드 전환 링크 */}
                                <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-[#00000073]">
                                    <span>{isSignIn ? "Don't have an account?" : "Already have an account?"}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleModeSwitch(isSignIn ? 'signup' : 'signin')}
                                        className="text-black font-semibold underline hover:text-gray-700 transition-colors"
                                    >
                                        {isSignIn ? 'Sign up' : 'Log in'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* --- 비밀번호 찾기 (Forgot Password) 화면 --- */}
                    {authMode === 'forgot' && (
                        <>
                            <button
                                onClick={() => handleModeSwitch('signin')}
                                className="flex items-center gap-2 text-[#00000073] hover:text-black transition-colors w-fit mb-2"
                            >
                                <ArrowBackIcon />
                                <span className="text-sm font-medium">Back to log in</span>
                            </button>

                            <div className="flex flex-col gap-3">
                                <h1 className="font-headline font-bold text-4xl leading-tight">
                                    Reset your password
                                </h1>
                                <p className="text-[#00000073] text-sm">
                                    No worries! Enter your email address below, and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-4 mt-2">
                                <div className="flex flex-col gap-1.5 relative">
                                    <label className="text-sm text-black font-medium">Email</label>
                                    <div className="flex items-center px-4 py-2.5 rounded-lg border border-solid border-[#00000040] focus-within:border-black transition-colors">
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-[#00000040]"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white font-label font-bold text-sm py-3 rounded-lg mt-1 transition-all hover:bg-gray-800"
                                >
                                    Submit
                                </button>
                            </form>
                        </>
                    )}

                    {/* --- 이메일 확인 (Check Email) 화면 --- */}
                    {authMode === 'check_email' && (
                        <div className="flex flex-col items-center text-center gap-4 mt-10">
                            <h1 className="font-headline font-bold text-4xl leading-tight">
                                Check your email
                            </h1>
                            <p className="text-[#00000073] text-sm max-w-[280px]">
                                We just sent a password reset link to your email. Please check your inbox.
                            </p>

                            <button
                                type="button"
                                onClick={() => handleModeSwitch('signin')}
                                className="w-full bg-black text-white font-label font-bold text-sm py-3 rounded-lg mt-6 transition-all hover:bg-gray-800"
                            >
                                Back to log in
                            </button>

                            <div className="flex items-center gap-1.5 mt-2 text-sm">
                                <span className="text-[#00000073]">Didn't receive the email?</span>
                                <button
                                    type="button"
                                    className="text-black font-semibold hover:underline transition-colors"
                                >
                                    Resend
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 약관 링크 (위치 고정) */}
                <div className="flex items-center justify-center gap-1 text-xs text-[#00000050] mt-6">
                    {(isSignIn || authMode === 'forgot' || authMode === 'check_email') ? (
                        <>
                            <button className="underline hover:text-black transition-colors">Terms of Service</button>
                            <span>and</span>
                            <button className="underline hover:text-black transition-colors">Privacy Policy</button>
                        </>
                    ) : (
                        <div className='text-center'>
                            By clicking "Sign Up", you agree to our
                            <button className="underline hover:text-black transition-colors mx-1">Terms of Service</button>
                            and
                            <button className="underline hover:text-black transition-colors ml-1">Privacy Policy</button>.
                        </div>
                    )}
                </div>
            </div>

            {/* 오른쪽 : 이미지/브랜딩 영역 (동일) */}
            <div className="hidden lg:flex flex-1 p-6 relative">
                <div
                    className="relative w-full h-full rounded-3xl overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599033769063-fcd3ef816810?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
                >
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Glassmorphism Card */}
                    <div className="absolute bottom-8 left-8 right-8 p-10 rounded-3xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 flex flex-col gap-6">
                        <h2 className="font-headline font-bold text-white text-[32px] tracking-[3.20px] leading-[1.3] [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                            STAY EXCITED<br />
                            WHILE PLANNING,<br />
                            WHILE EXPLORING
                        </h2>
                        <p className="font-headline text-white/80 text-base tracking-wide">
                            Reckless Soybeans Co.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}