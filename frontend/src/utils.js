export function getAuthHeader() {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  return {
    Authorization: "Basic " + btoa(email + ":" + password)
  };
}
