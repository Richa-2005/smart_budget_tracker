export const getToken = () => {
  return localStorage.getItem('token');
};

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isLoggedIn = () => {
  const token = getToken();
  return token && token !== 'null' && token !== 'undefined';
};