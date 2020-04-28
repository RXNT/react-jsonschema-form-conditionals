// https://jestjs.io/docs/en/es6-class-mocks#manual-mock
export const isDevelopmentMock = jest.fn(() => true);
export default {
  isDevelopment: isDevelopmentMock,
};
