const isDevelopment = () => {
  return process.env.NODE_ENV !== "production";
};

export default {
  isDevelopment,
};
