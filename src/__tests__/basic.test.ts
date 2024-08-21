describe('Basic Arithmetic', () => {
	it('correctly adds two numbers', () => {
		expect(2 + 2).toBe(4);
	});

	it('handles negative numbers', () => {
		expect(-1 + 1).toBe(0);
	});

	it('performs multiplication', () => {
		expect(3 * 4).toBe(12);
	});
});
