import ElementFactory from './Elements';

test('can create elements without params', () => {
    expect(typeof(ElementFactory.newElement())).toBe('object');
});

test('can create elements with params', () => {
    let params = {
        label:'Them Labelz',
    };
    expect(ElementFactory.newElement(params).label).toBe('Them Labelz');
});

test('can create elements other than screen', () => {
    let params = {
        type:3,
    };
    expect(ElementFactory.newElement(params).label).toBe('Group N');
});
