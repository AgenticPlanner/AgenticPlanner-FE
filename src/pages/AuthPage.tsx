import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [user_name, setUser_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isSignIn = authMode === 'signin';

    useEffect(() => {
        validate();
    }, [user_name, email, password, confirmPassword, authMode]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (user_name.length > 0) {
            const hasSpace = /\s/.test(user_name);
            const nameRegex = /^[a-zA-Z가-힣0-9]+$/;
            if (hasSpace) {
                newErrors.user_name = "공백은 사용할 수 없습니다.";
            } else if (!nameRegex.test(user_name)) {
                newErrors.user_name = "특수문자는 사용할 수 없습니다.";
            } else if (user_name.length < 2 || user_name.length > 10) {
                newErrors.user_name = "2~10자 사이로 입력해주세요.";
            }
        }

        if (!isSignIn) {
            if (email.length > 0) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (/\s/.test(email)) {
                    newErrors.email = "공백을 포함할 수 없습니다.";
                } else if (!emailRegex.test(email)) {
                    newErrors.email = "올바른 이메일 형식이 아닙니다.";
                }
            }

            if (password.length > 0) {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(password)) {
                    newErrors.password = "8자 이상, 영문/숫자/특수문자 조합 필요";
                }
            }

            if (password && confirmPassword && password !== confirmPassword) {
                newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');

        // 프론트엔드 자체 유효성 검사
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (isSignIn) {
                await login(user_name, password);
                const from = (location.state as { from?: string } | null)?.from ?? '/plan';
                navigate(from, { replace: true });
            } else {
                await register(email, password, user_name);
                handleModeSwitch('signin');
            }
        } catch (err: any) {
            const apiData = err.response?.data;
            console.log('API Error Response:', apiData);

            if (apiData) {
                const newFieldErrors: Record<string, string> = {};

                //회원가입
                // username already exists
                if (apiData.username) {
                    newFieldErrors.user_name = "이미 존재하는 사용자 이름입니다.";
                }
                // email already exists
                if (apiData.email) {
                    newFieldErrors.email = "이미 가입된 이메일입니다.";
                }

                // 로그인
                //  already exists
                if (apiData.detail) {
                    setErrorMsg("이메일 또는 비밀번호가 일치하지 않습니다.");
                }

                setErrors(prev => ({ ...prev, ...newFieldErrors }));

                if (apiData.message) {
                    setErrorMsg(apiData.message);
                }
            } else {
                // 아예 응답이 없거나 네트워크 오류인 경우
                setErrorMsg('인증에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModeSwitch = (mode: 'signin' | 'signup') => {
        setAuthMode(mode);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUser_name('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setErrorMsg('');
        setErrors({});
    };

    return (
        <div className="h-[100dvh] w-full bg-background flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-lg z-10 flex flex-col items-center">
                <div className="bg-surface-container-lowest rounded-lg p-8 shadow-ambient w-full">
                    <div className="mb-8">
                        <h3 className="font-headline font-extrabold text-3xl text-on-surface leading-tight mb-2">
                            {isSignIn ? 'Sign In' : 'Create an Account'}
                        </h3>
                        <p className="text-sm font-medium text-on-surface-variant">
                            {isSignIn ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => handleModeSwitch('signup')}
                                        className="text-primary font-bold hover:text-primary-dim hover:underline transition-colors"
                                    >
                                        Create one
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => handleModeSwitch('signin')}
                                        className="text-primary font-bold hover:text-primary-dim hover:underline transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    <form key={authMode} className="space-y-4" onSubmit={handleAuthSubmit} noValidate>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end px-1">
                                <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">User Name</label>
                                {errors.user_name && <span className="text-[10px] text-red-500 font-bold">{errors.user_name}</span>}
                            </div>
                            <input
                                type="text"
                                value={user_name}
                                onChange={(e) => setUser_name(e.target.value)}
                                placeholder="Captain"
                                className={`w-full bg-surface-container-low border-none rounded-md py-3 px-5 focus:ring-2 transition-all placeholder:text-outline-variant text-on-surface ${errors.user_name ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'}`}
                            />
                        </div>

                        {!isSignIn && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Email Address</label>
                                    {errors.email && <span className="text-[10px] text-red-500 font-bold">{errors.email}</span>}
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@luxury-travel.com"
                                    className={`w-full bg-surface-container-low border-none rounded-md py-3 px-5 focus:ring-2 transition-all placeholder:text-outline-variant text-on-surface ${errors.email ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'}`}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end px-1">
                                <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Password</label>
                                {errors.password ? (
                                    <span className="text-[10px] text-red-500 font-bold">{errors.password}</span>
                                ) : (
                                    isSignIn && (
                                        <Link to="/forgot" className="text-xs font-semibold text-primary hover:text-primary-dim transition-colors">
                                            Forgot your password?
                                        </Link>
                                    )
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-surface-container-low border-none rounded-md py-3 pl-5 pr-12 focus:ring-2 transition-all placeholder:text-outline-variant text-on-surface ${errors.password ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {!isSignIn && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Confirm Password</label>
                                    {errors.confirmPassword && <span className="text-[10px] text-red-500 font-bold">{errors.confirmPassword}</span>}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full bg-surface-container-low border-none rounded-md py-3 pl-5 pr-12 focus:ring-2 transition-all placeholder:text-outline-variant text-on-surface ${errors.confirmPassword ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {errorMsg && (
                            <p className="text-sm font-medium text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                                {errorMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full signature-gradient text-on-primary font-headline font-bold py-3.5 rounded-full mt-4 flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60"
                            style={{ boxShadow: '0 20px 40px -10px rgba(16, 106, 104, 0.4)' }}
                        >
                            {isSubmitting ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-on-primary" />
                            ) : (
                                <>
                                    {isSignIn ? 'Sign In' : 'Create Account'}
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 flex justify-center items-center">
                        <div className="absolute w-full h-[1px] bg-surface-container-high" />
                        <span className="relative bg-surface-container-lowest px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-outline-variant">
                            Or connect with
                        </span>
                    </div>

                    <button className="w-full bg-surface-container-high text-on-secondary-container font-headline font-bold py-3.5 rounded-full flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-colors">
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className="w-4 h-4" />
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center mt-6 text-[11px] text-on-surface-variant leading-relaxed px-8 font-medium">
                    By continuing, you agree to our
                    <Link to="/terms" className="text-primary font-bold hover:underline mx-1">Terms of Service</Link>
                    and
                    <Link to="/privacy" className="text-primary font-bold hover:underline mx-1">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}