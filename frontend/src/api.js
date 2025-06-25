const API = "https://de89-103-230-106-28.ngrok-free.app";
// const API = "http://localhost:8080"


export async function login(email, password) {
  const res = await fetch(`${API}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function signUp(userData) {
  const res = await fetch(`${API}/api/user/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res;
}