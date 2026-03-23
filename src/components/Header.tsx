export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
          Agentic Planner
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Login Button */}
          <button
            className="px-6 py-2 bg-[#EAF0EC] dark:bg-gray-800 border-2 border-[#C5D0C9] dark:border-gray-700 rounded-full font-semibold text-sm text-gray-900 dark:text-gray-100 hover:bg-[#D8E3DC] hover:border-[#A0B0A8] dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-all duration-200"
            aria-label="로그인"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
