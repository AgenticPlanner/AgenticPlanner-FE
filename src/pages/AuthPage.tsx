import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isSignIn = authMode === 'signin';

    return (
        <div className="h-[100dvh] w-full bg-background flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-lg z-10 flex flex-col items-center">
                {/* Main Auth Card */}
                <div className="bg-surface-container-lowest rounded-lg p-8 shadow-ambient w-full">

                    {/* Header Section with Inline Toggle */}
                    <div className="mb-8">
                        <h3 className="font-headline font-extrabold text-3xl text-on-surface leading-tight mb-2">
                            {isSignIn ? 'Sign In' : 'Create an Account'}
                        </h3>
                        <p className="text-sm font-medium text-on-surface-variant">
                            {isSignIn ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setAuthMode('signup')}
                                        className="text-primary font-bold hover:text-primary-dim hover:underline transition-colors"
                                    >
                                        Create one
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => setAuthMode('signin')}
                                        className="text-primary font-bold hover:text-primary-dim hover:underline transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Form Area */}
                    <form key={authMode} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {/* Full Name (Signup Only) */}
                        {!isSignIn && (
                            <div className="space-y-1.5">
                                <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Captain John Doe"
                                    className="w-full bg-surface-container-low border-none rounded-md py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-on-surface"
                                />
                            </div>
                        )}

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@luxury-travel.com"
                                className="w-full bg-surface-container-low border-none rounded-md py-3 px-5 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-on-surface"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest">Password</label>
                                {isSignIn && (
                                    <Link to="/forgot" className="text-xs font-semibold text-primary hover:text-primary-dim transition-colors">
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-surface-container-low border-none rounded-md py-3 pl-5 pr-12 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-on-surface"
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

                        {/* Confirm Password (Signup Only) */}
                        {!isSignIn && (
                            <div className="space-y-1.5">
                                <label className="block text-on-surface-variant text-xs font-bold uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-surface-container-low border-none rounded-md py-3 pl-5 pr-12 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-on-surface"
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

                        {/* Main CTA Button */}
                        <button
                            type="submit"
                            className="w-full signature-gradient text-on-primary font-headline font-bold py-3.5 rounded-full mt-4 flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
                            style={{ boxShadow: '0 20px 40px -10px rgba(16, 106, 104, 0.4)' }}
                        >
                            {isSignIn ? 'Sign In' : 'Create Account'}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8 flex justify-center items-center">
                        <div className="absolute w-full h-[1px] bg-surface-container-high" />
                        <span className="relative bg-surface-container-lowest px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-outline-variant">
                            Or connect with
                        </span>
                    </div>

                    {/* Social Auth Button */}
                    <button className="w-full bg-surface-container-high text-on-secondary-container font-headline font-bold py-3.5 rounded-full flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-colors">
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className="w-4 h-4" />
                        Sign in with Google
                    </button>
                </div>

                {/* Footnote */}
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