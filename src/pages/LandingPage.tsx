import { useState } from 'react';

// 카테고리 더미 데이터 (이미지는 임시 플레이스홀더 사용)
const categories = [
  { id: 1, title: '결혼식', imgSrc: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 2, title: '친구들과 드라이브', imgSrc: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 3, title: '가족 행사/휴가', imgSrc: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 4, title: '스키 여행', imgSrc: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 5, title: '홈 파티', imgSrc: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 6, title: '가족 여행', imgSrc: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=200&h=200' },
];

export default function LandingPage() {
  const [inputValue, setInputValue] = useState('3일 알프스 스키 여행을 친구들과 예산 범위 내에서 계획하고 싶어요');
  const [activeCategory, setActiveCategory] = useState<number | null>(4); // 초기값으로 스키 여행 활성화

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-4 font-sans">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-10 tracking-tight text-center">
        무엇을 함께 계획하고 싶으신가요?
      </h1>

      {/* Input Field */}
      <div className="w-full max-w-3xl mb-12">
        <div className="relative flex items-center w-full px-6 py-4 bg-[#eef3f0] border border-[#cbd5ce] rounded-full shadow-sm">
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-gray-800 text-lg placeholder-gray-500 font-medium"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="계획하고 싶은 내용을 말씀해주세요..."
          />
          {/* 깜빡이는 커서 효과를 위한 장식 (옵션) */}
          <span className="w-0.5 h-6 bg-gray-800 animate-pulse ml-1"></span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center p-2 rounded-2xl transition-all duration-200 text-left w-full
              ${
                activeCategory === category.id
                  ? 'bg-[#d1d5db]' // 선택된 상태 (회색 배경)
                  : 'bg-[#f3f4f6] hover:bg-[#e5e7eb]' // 기본 상태
              }
            `}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-xl">
              <img
                src={category.imgSrc}
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-6 text-lg font-medium text-gray-800">
              {category.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}