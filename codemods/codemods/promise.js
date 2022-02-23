export const getTemplates = () => ({
  type: GET_TEMPLATES,
  promise: request(AuthHelper.isUserLoggedIn(), getTemplatesroute(), 'GET'),
});
