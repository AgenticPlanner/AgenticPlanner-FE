interface OnboardingSectionProps {
  howItWorks: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  ctaButton: string;
}

export default function OnboardingSection({
  howItWorks,
  step1Title,
  step1Desc,
  step2Title,
  step2Desc,
  step3Title,
  step3Desc,
  ctaButton,
}: OnboardingSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-20 py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto">
        
        {/* Section Title */}
        <h2 className="text-[2.5rem] md:text-[4rem] font-serif text-gray-900 dark:text-white mb-16 text-center tracking-tight leading-tight">
          {howItWorks}
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-white dark:text-gray-900">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {step1Title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {step1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-white dark:text-gray-900">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {step2Title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {step2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-bold text-white dark:text-gray-900">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {step3Title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {step3Desc}
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={scrollToTop}
            className="px-8 py-3 bg-[#EAF0EC] dark:bg-gray-800 border-2 border-[#C5D0C9] dark:border-gray-700 rounded-full font-semibold text-sm text-gray-900 dark:text-gray-100 hover:bg-[#D8E3DC] hover:border-[#A0B0A8] dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-all duration-200"
          >
            {ctaButton} 👆
          </button>
        </div>

      </div>
    </div>
  );
}
