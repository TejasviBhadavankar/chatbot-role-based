export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordRegex.test(password);
};
