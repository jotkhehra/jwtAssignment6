import jwtDecode from "jwt-decode";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(user, password, password2) {
  const registerUrl = `${apiUrl}/register`;
   
  console.log('API URL:', registerUrl);
  console.log('Request Body:', { userName: user, password: password, password2: password2 });

  const res = await fetch(registerUrl, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password: password, password2: password2 }),
      headers: {
          'Content-Type': 'application/json',
      },
  });

  if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
  }

  const data = await res.json();

  return data;
}

function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function getToken() {
    try {
      return localStorage.getItem('access_token');
    } catch (err) {
      return null;
    }
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function readToken() {
    try {
      const token = getToken();
      return token ? jwtDecode(token) : null;
    } catch (err) {
      return null;
    }
}

export function isAuthenticated() {
    const token = readToken();
    return token ? true : false;
}

export async function authenticateUser(user, password) {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password: password }),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      setToken(data.token);
      return true;
    } else {
      throw new Error(data.message);
    }
}
