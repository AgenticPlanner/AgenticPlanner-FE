export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Agentic Planner</h3>
            <p className="text-gray-400 text-sm">
              AI 기반 계획 도구로 여행, 행사, 모험을 쉽게 정리하세요.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">홈</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">기능</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">회사 소개</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">문의</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">팔로우</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">트위터</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">페이스북</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">인스타그램</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Agentic Planner. 모든 권리 보유.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">개인정보 보호정책</a>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
