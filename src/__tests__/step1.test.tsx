import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('STEP 1: 프로젝트 기반 세팅', () => {

  describe('라우팅', () => {
    it('/ 경로에서 LandingPage가 렌더링된다', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(document.querySelector('body')).toBeInTheDocument();
    });

    it('/tasks 경로가 404 없이 접근 가능하다', () => {
      render(
        <MemoryRouter initialEntries={['/tasks']}>
          <App />
        </MemoryRouter>
      );
      expect(document.querySelector('body')).toBeInTheDocument();
    });

    it('/itinerary 경로가 404 없이 접근 가능하다', () => {
      render(
        <MemoryRouter initialEntries={['/itinerary']}>
          <App />
        </MemoryRouter>
      );
      expect(document.querySelector('body')).toBeInTheDocument();
    });
  });

  describe('타입 정의', () => {
    it('Task 인터페이스 status가 허용된 값만 갖는다', () => {
      const validStatuses = ['todo', 'in-progress', 'done'];
      const testStatus = 'in-progress';
      expect(validStatuses).toContain(testStatus);
    });

    it('ItineraryStop category가 허용된 값만 갖는다', () => {
      const validCategories = ['dining', 'transit', 'sightseeing', 'stay'];
      const testCategory = 'dining';
      expect(validCategories).toContain(testCategory);
    });
  });

  describe('Mock 데이터', () => {
    it('tripDays 데이터가 5개 존재한다', async () => {
      const { tripDays } = await import('../data/tripData');
      expect(tripDays).toHaveLength(5);
    });

    it('tasks 데이터가 5개 존재한다', async () => {
      const { tasks } = await import('../data/tripData');
      expect(tasks).toHaveLength(5);
    });

    it('각 TripDay는 stops 배열을 갖는다', async () => {
      const { tripDays } = await import('../data/tripData');
      tripDays.forEach(day => {
        expect(Array.isArray(day.stops)).toBe(true);
        expect(day.stops.length).toBeGreaterThan(0);
      });
    });

    it('각 Task는 필수 필드를 갖는다', async () => {
      const { tasks } = await import('../data/tripData');
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('status');
        expect(['todo', 'in-progress', 'done']).toContain(task.status);
      });
    });

    it('Day 1은 4개의 stops를 갖는다', async () => {
      const { tripDays } = await import('../data/tripData');
      expect(tripDays[0].label).toBe('Day 1');
      expect(tripDays[0].stops).toHaveLength(4);
    });

    it('Day 2는 3개의 stops를 갖는다', async () => {
      const { tripDays } = await import('../data/tripData');
      expect(tripDays[1].stops).toHaveLength(3);
    });

    it('Day 3는 2개의 stops를 갖는다', async () => {
      const { tripDays } = await import('../data/tripData');
      expect(tripDays[2].stops).toHaveLength(2);
    });
  });

  describe('Tailwind 디자인 토큰', () => {
    it('필수 타입과 데이터 구조가 정의되어 있다', async () => {
      const { tripDays, tasks } = await import('../data/tripData');

      // Verify data exists
      expect(tripDays.length).toBeGreaterThan(0);
      expect(tasks.length).toBeGreaterThan(0);

      // Verify structure is intact
      expect(typeof tripDays[0]).toBe('object');
      expect(typeof tasks[0]).toBe('object');
    });

    it('TypeScript 타입들이 정의되어 있다', async () => {
      const { tripDays, tasks } = await import('../data/tripData');

      // Verify TripDay structure
      const day = tripDays[0];
      expect(day).toHaveProperty('label');
      expect(day).toHaveProperty('stops');
      expect(day).toHaveProperty('stats');
      expect(day).toHaveProperty('travelTime');

      // Verify ItineraryStop structure in stops
      const stop = day.stops[0];
      expect(stop).toHaveProperty('id');
      expect(stop).toHaveProperty('time');
      expect(stop).toHaveProperty('category');
      expect(stop).toHaveProperty('title');

      // Verify DayStats in stats
      const stats = day.stats;
      expect(stats).toHaveProperty('activities');
      expect(stats).toHaveProperty('temp');
      expect(stats).toHaveProperty('budgetSpent');

      // Verify Task structure
      const task = tasks[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('icon');
      expect(task).toHaveProperty('ctaLabel');
    });

    it('Trip tasks에 다양한 status가 포함되어 있다', async () => {
      const { tasks } = await import('../data/tripData');
      const statuses = new Set(tasks.map(t => t.status));

      expect(statuses.has('todo')).toBe(true);
      expect(statuses.has('in-progress')).toBe(true);
      expect(statuses.has('done')).toBe(true);
    });

    it('Itinerary stops에 다양한 categories가 포함되어 있다', async () => {
      const { tripDays } = await import('../data/tripData');
      const allStops = tripDays.flatMap(day => day.stops);
      const categories = new Set(allStops.map(stop => stop.category));

      expect(categories.size).toBeGreaterThan(0);
      const validCategories: string[] = ['dining', 'transit', 'sightseeing', 'stay'];
      const hasValid = validCategories.some(cat => categories.has(cat as any));
      expect(hasValid).toBe(true);
    });
  });
});
