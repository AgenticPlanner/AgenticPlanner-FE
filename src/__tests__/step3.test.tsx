import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskPage from '../pages/TaskPage';
import TaskCard from '../components/tasks/TaskCard';
import AddTaskPlaceholder from '../components/tasks/AddTaskPlaceholder';
import { tripTasks } from '../data/tripData';
import type { Task } from '../types';

describe('STEP 3: Task 페이지', () => {

  describe('TaskCard 컴포넌트', () => {
    const mockTask: Task = {
      id: 'test-1',
      title: 'Test Task',
      description: 'Test description',
      status: 'in-progress',
      icon: 'flight_takeoff',
      ctaLabel: 'Review',
      assignees: [],
    };

    it('제목이 렌더링된다', () => {
      render(<MemoryRouter><TaskCard task={mockTask} /></MemoryRouter>);
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('설명이 렌더링된다', () => {
      render(<MemoryRouter><TaskCard task={mockTask} /></MemoryRouter>);
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('in-progress 상태 배지가 "In Progress"로 렌더링된다', () => {
      render(<MemoryRouter><TaskCard task={mockTask} /></MemoryRouter>);
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('todo 상태 배지가 "To Do"로 렌더링된다', () => {
      const todoTask = { ...mockTask, status: 'todo' as const };
      render(<MemoryRouter><TaskCard task={todoTask} /></MemoryRouter>);
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('done 상태 배지가 "Done"으로 렌더링된다', () => {
      const doneTask = { ...mockTask, status: 'done' as const };
      render(<MemoryRouter><TaskCard task={doneTask} /></MemoryRouter>);
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('done 카드는 제목에 line-through 클래스를 갖는다', () => {
      const doneTask = { ...mockTask, status: 'done' as const };
      render(<MemoryRouter><TaskCard task={doneTask} /></MemoryRouter>);
      const title = screen.getByText('Test Task');
      expect(title.className).toMatch(/line-through/);
    });

    it('done 카드의 CTA 버튼은 disabled 처리된다', () => {
      const doneTask = { ...mockTask, status: 'done' as const, ctaLabel: 'View Receipt' };
      render(<MemoryRouter><TaskCard task={doneTask} /></MemoryRouter>);
      const btn = screen.getByText('View Receipt').closest('button');
      expect(btn?.className).toMatch(/cursor-not-allowed/);
    });

    it('featured 카드는 lg:col-span-2 래퍼를 갖는다', () => {
      const { container } = render(
        <MemoryRouter><TaskCard task={mockTask} featured /></MemoryRouter>
      );
      // featured 카드는 lg:col-span-2 클래스를 포함
      const wrapper = container.querySelector('div');
      expect(wrapper?.className).toMatch(/lg:col-span-2/);
    });

    it('featured 카드는 CTA 버튼을 렌더링한다', () => {
      render(
        <MemoryRouter><TaskCard task={mockTask} featured ctaLabel="Start" /></MemoryRouter>
      );
      const btn = screen.getByText('Review').closest('button');
      expect(btn?.className).toMatch(/bg-primary/);
    });

    it('standard 카드는 full-width CTA 버튼을 렌더링한다', () => {
      render(<MemoryRouter><TaskCard task={mockTask} featured={false} /></MemoryRouter>);
      const btn = screen.getByText('Review').closest('button');
      expect(btn?.className).toMatch(/w-full/);
    });

    it('Material Symbol 아이콘이 렌더링된다', () => {
      render(<MemoryRouter><TaskCard task={mockTask} /></MemoryRouter>);
      const icon = document.querySelector('.material-symbols-outlined');
      expect(icon?.textContent).toContain('flight_takeoff');
    });

    it('done 상태에서는 check_circle 아이콘이 렌더링된다', () => {
      render(<MemoryRouter><TaskCard task={{ ...mockTask, status: 'done' }} /></MemoryRouter>);
      const icon = document.querySelector('.material-symbols-outlined');
      expect(icon?.textContent).toContain('check_circle');
    });
  });

  describe('AddTaskPlaceholder 컴포넌트', () => {
    it('"마일스톤 추가" 텍스트가 렌더링된다', () => {
      render(<AddTaskPlaceholder />);
      expect(screen.getByText('마일스톤 추가')).toBeInTheDocument();
    });

    it('dashed border 클래스를 갖는다', () => {
      const { container } = render(<AddTaskPlaceholder />);
      const button = container.querySelector('button');
      expect(button?.className).toMatch(/border-dashed/);
    });

    it('"add" Material Symbol 아이콘이 존재한다', () => {
      render(<AddTaskPlaceholder />);
      const icons = document.querySelectorAll('.material-symbols-outlined');
      const iconTexts = Array.from(icons).map(el => el.textContent?.trim());
      expect(iconTexts).toContain('add');
    });

    it('호버 시 border-primary로 변한다', () => {
      const { container } = render(<AddTaskPlaceholder />);
      const button = container.querySelector('button');
      expect(button?.className).toMatch(/hover:border-primary/);
    });
  });

  describe('TaskPage 전체', () => {
    const renderTaskPage = () =>
      render(
        <MemoryRouter initialEntries={['/tasks']}>
          <TaskPage />
        </MemoryRouter>
      );

    it('"기본 계획" 헤딩이 렌더링된다', () => {
      renderTaskPage();
      expect(screen.getByText('기본 계획')).toBeInTheDocument();
    });

    it('"여행 기반" eyebrow 텍스트가 렌더링된다', () => {
      renderTaskPage();
      expect(screen.getByText('여행 기반')).toBeInTheDocument();
    });

    it('20% 진행률이 표시된다', () => {
      const { container } = renderTaskPage();
      // Check if the page contains the percentage text (1 out of 5 tasks are done = 20%)
      expect(container.textContent).toContain('20%');
    });

    it('"진행률" 레이블이 표시된다', () => {
      const { container } = renderTaskPage();
      const labels = container.querySelectorAll('p');
      const progressLabel = Array.from(labels).find(el => el.textContent?.includes('진행률'));
      expect(progressLabel).toBeInTheDocument();
    });

    it('진행률 바가 존재한다', () => {
      const { container } = renderTaskPage();
      const progressBar = container.querySelector('.signature-gradient');
      expect(progressBar).toBeInTheDocument();
    });

    it('5개의 Task 카드가 렌더링된다', () => {
      renderTaskPage();
      tripTasks.forEach(task => {
        expect(screen.getByText(task.title)).toBeInTheDocument();
      });
    });

    it('AddTaskPlaceholder가 렌더링된다', () => {
      renderTaskPage();
      expect(screen.getByText('마일스톤 추가')).toBeInTheDocument();
    });

    it('첫 번째 task는 CTA 버튼이 primary 배경을 갖는다 (featured)', () => {
      renderTaskPage();
      const firstTaskBtn = screen.getByText(tripTasks[0].ctaLabel).closest('button');
      expect(firstTaskBtn?.className).toMatch(/bg-primary/);
    });

    it('AppLayout(SideNav + TopBar)이 포함된다', () => {
      renderTaskPage();
      expect(screen.getByText('Trip Planner')).toBeInTheDocument();
      // TaskPage sets topBarTitle="작업", so the TopBar displays "작업"
      expect(screen.getAllByText('작업')[0]).toBeInTheDocument();
    });

    it('SideNav 네비게이션 링크들이 존재한다', () => {
      renderTaskPage();
      const allTaskButtons = screen.getAllByText('작업');
      const allItineraryButtons = screen.getAllByText('일정');
      expect(allTaskButtons.length).toBeGreaterThan(0);
      expect(allItineraryButtons.length).toBeGreaterThan(0);
    });

    it('여행 설명 텍스트가 렌더링된다', () => {
      renderTaskPage();
      expect(screen.getByText('태평양 해안 고속도로 여행의 모든 준비 작업을 추적하세요')).toBeInTheDocument();
    });

    it('그리드 레이아웃이 6개 항목을 포함한다 (5 tasks + 1 placeholder)', () => {
      const { container } = renderTaskPage();
      const gridItems = container.querySelectorAll('.grid > *');
      expect(gridItems.length).toBe(6);
    });

    it('첫 번째 task 카드의 상태 배지는 "In Progress"', () => {
      renderTaskPage();
      expect(screen.getAllByText('In Progress')[0]).toBeInTheDocument();
    });
  });
});
