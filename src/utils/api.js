import axios from 'axios';
const logout = () => {
  localStorage.clear();
  window.location.href = '/sign-in';
};

const fetchRequest = async ({ url = '', method, isAuth, body, isFormData, withBaseUrl }) => {
  let headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json'; // While sending form data so not set content type
  if (isAuth) headers['Authorization'] = localStorage.getItem('token');

  let options = { method, headers };
  if (method === 'POST' || method === 'PUT') options['body'] = body ? (isFormData ? body : JSON.stringify(body)) : {};
  let fetchUrl = withBaseUrl ? `${url}` : `${process.env.REACT_APP_PUBLIC_URL}${url}`;
  const response = await fetch(fetchUrl, options);
  try {
    // return response && response.status === 401 ? refreshToken() : response;
    return response && response.status === 401 ? logout() : response;
  } catch (e) {
    return null;
  }
};

const makeRequest = async ({ url = '', method, isAuth, body, isFormData, withBaseUrl }, defaultValue = {}) => {
  let headers = {};
  console.log(process.env);
  if (!isFormData) headers['Content-Type'] = 'application/json'; // While sending form data so not set content type
  if (isAuth) headers['Authorization'] = localStorage.getItem('token');

  let options = { method, headers };
  if (method === 'POST' || method === 'PUT') options.data = body ? (isFormData ? body : JSON.stringify(body)) : {};
  options.url = withBaseUrl ? `${url}` : `${process.env.REACT_APP_PUBLIC_URL}${url}`;

  let finalResponse = {};

  try {
    const response = await axios(options);
    if (response) finalResponse = { data: response.data, status: response.status, message: response.statusText };
    return finalResponse;
  } catch (err) {
    const { data, status } = err.response;
    if (status === 422) finalResponse = { errors: data.errors, status, message: data.message };
    else if (status === 400 || status === 404) finalResponse = { status, message: data.message };
    // TODO : 500
    // else if (status === 401) logout();
    return finalResponse;
  }
};

export { fetchRequest, makeRequest };
