import infoReducer, {
  InfoState,
  getInfo,
} from './infoSlice';

describe('info reducer', () => {
  const initialState: InfoState = {
    product: "",
    description: "",
    tags: [],
    status: 'idle',
    productImg:"",
  };
  it('should handle initial state', () => {
    expect(infoReducer(undefined, { type: 'unknown' })).toEqual({
      product: "",
      description: "",
      tags: [],
      status: 'idle',
      productImg:"",
    });
  });

  it('should handle get information', () => {
    const actual = infoReducer(initialState, getInfo());
    expect(actual.product).toEqual("Shark Ninja");
  });
});
