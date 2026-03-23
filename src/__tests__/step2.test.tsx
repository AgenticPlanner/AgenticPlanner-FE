import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SideNav from '../components/layout/SideNav';
import TopBar from '../components/layout/TopBar';

describe('STEP 2: 공통 레이아웃 컴포넌트', () => {

  describe('SideNav', () => {
    const renderSideNav = (path = '/tasks') =>
      render(
        <MemoryRouter initialEntries={[path]}>
          <SideNav />
        </MemoryRouter>
      );

    it('앱 타이틀 "Trip Planner"가 렌더링된다', () => {
      renderSideNav();
      expect(screen.getByText('Trip Planner')).toBeInTheDocument();
    });

    it('부제목 "Pacific Coast Hwy"가 렌더링된다', () => {
      renderSideNav();
      expect(screen.getByText('Pacific Coast Hwy')).toBeInTheDocument();
    });

    it('4개의 네비게이션 링크가 존재한다', () => {
      renderSideNav();
      expect(screen.getByText('작업')).toBeInTheDocument();
      expect(screen.getByText('일정')).toBeInTheDocument();
      expect(screen.getByText('지도')).toBeInTheDocument();
      expect(screen.getByText('탐색')).toBeInTheDocument();
    });

    it('/tasks 경로에서 작업 링크가 active 스타일을 갖는다', () => {
      renderSideNav('/tasks');
      const tasksLink = screen.getByText('작업').closest('a');
      expect(tasksLink?.className).toMatch(/text-primary/);
    });

    it('/itinerary 경로에서 일정 링크가 active 스타일을 갖는다', () => {
      renderSideNav('/itinerary');
      const itineraryLink = screen.getByText('일정').closest('a');
      expect(itineraryLink?.className).toMatch(/text-primary/);
    });

    it('"새로운 일정" CTA 버튼이 존재한다', () => {
      renderSideNav();
      expect(screen.getByText('새로운 일정')).toBeInTheDocument();
    });

    it('유저 이름 "Alex Rivera"가 렌더링된다', () => {
      renderSideNav();
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    });

    it('유저 등급 "프리미엄 멤버"가 렌더링된다', () => {
      renderSideNav();
      expect(screen.getByText('프리미엄 멤버')).toBeInTheDocument();
    });

    it('nav 링크들이 react-router Link로 렌더링된다', () => {
      renderSideNav();
      const tasksLink = screen.getByText('작업').closest('a');
      // react-router Link는 href prop을 그대로 사용
      expect(tasksLink).toHaveAttribute('href', '/tasks');
    });

    it('Material Symbol 아이콘들이 렌더링된다', () => {
      renderSideNav();
      const icons = document.querySelectorAll('.material-symbols-outlined');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('TopBar', () => {
    const renderTopBar = () =>
      render(
        <MemoryRouter>
          <TopBar />
        </MemoryRouter>
      );

    it('"Agentic Planner" 타이틀이 렌더링된다', () => {
      renderTopBar();
      expect(screen.getByText('Agentic Planner')).toBeInTheDocument();
    });

    it('검색 input이 존재한다', () => {
      renderTopBar();
      const searchInput = screen.getByPlaceholderText(/작업이나 여행/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('알림 버튼이 존재한다 (notifications 아이콘)', () => {
      renderTopBar();
      const icons = document.querySelectorAll('.material-symbols-outlined');
      const iconTexts = Array.from(icons).map(el => el.textContent);
      expect(iconTexts).toContain('notifications');
    });

    it('설정 버튼이 존재한다 (settings 아이콘)', () => {
      renderTopBar();
      const icons = document.querySelectorAll('.material-symbols-outlined');
      const iconTexts = Array.from(icons).map(el => el.textContent);
      expect(iconTexts).toContain('settings');
    });

    it('customTitle prop으로 제목을 변경할 수 있다', () => {
      render(
        <MemoryRouter>
          <TopBar title="작업" />
        </MemoryRouter>
      );
      expect(screen.getByText('작업')).toBeInTheDocument();
    });
  });

  describe('AppLayout', () => {
    it('children이 렌더링된다', () => {
      render(
        <MemoryRouter>
          <AppLayout>
            <div data-testid="test-child">Content</div>
          </AppLayout>
        </MemoryRouter>
      );
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('SideNav와 TopBar가 함께 렌더링된다', () => {
      render(
        <MemoryRouter>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </MemoryRouter>
      );
      expect(screen.getByText('Trip Planner')).toBeInTheDocument();
      expect(screen.getByText('Agentic Planner')).toBeInTheDocument();
    });

    it('레이아웃이 flex 구조를 갖는다', () => {
      const { container } = render(
        <MemoryRouter>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </MemoryRouter>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper?.className).toMatch(/flex/);
    });

    it('main 요소가 overflow-y-auto를 갖는다', () => {
      const { container } = render(
        <MemoryRouter>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </MemoryRouter>
      );
      const main = container.querySelector('main');
      expect(main?.className).toMatch(/overflow-y-auto/);
    });
  });
});
