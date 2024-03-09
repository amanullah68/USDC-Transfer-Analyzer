export default ({ data = "", message = "", error = "" }) => {
  return {
    status: !error,
    data,
    message,
    error,
  };
};
