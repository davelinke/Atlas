import FilterTools from './FilterTools';

test('can create elements with params', () => {
    expect(FilterTools.roundToMultiple(4,10)).toBe(0);
    expect(FilterTools.roundToMultiple(6,10)).toBe(10);
});
