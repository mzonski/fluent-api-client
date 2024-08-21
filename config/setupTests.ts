const FIXED_DATE = new Date('2024-01-01T00:00:00Z');

beforeAll(() => {
	vi.useFakeTimers();
	vi.setSystemTime(FIXED_DATE);
});

afterAll(() => {
	vi.useRealTimers();
});
