import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return req;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const isUnauthorized =
        error &&
        error.response &&
        error.response.status === 401 &&
        typeof error.response.data?.error === "string" &&
        error.response.data.error.includes("Unauthorized");

      if (isUnauthorized) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;


