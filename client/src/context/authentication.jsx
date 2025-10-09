import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import axios from "axios";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api";

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({ ...prevState, user: null, getUserLoading: false }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(`${apiBase}/auth/get-user`);
      setState((prevState) => ({ ...prevState, user: response.data, getUserLoading: false }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  const login = async (data, navigate) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(`${apiBase}/auth/login`, data);
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      
      // Fetch user data to get role
      const userResponse = await axios.get(`${apiBase}/auth/get-user`);
      const userData = userResponse.data;
      
      // Force state update synchronously
      flushSync(() => {
        setState((prevState) => ({ ...prevState, user: userData }));
      });
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate("/admin/articles");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed";
      setState((prevState) => ({ ...prevState, loading: false, error: msg }));
      return { error: msg };
    }
  };

  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(`${apiBase}/auth/register`, data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed";
      setState((prevState) => ({ ...prevState, loading: false, error: msg }));
      return { error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, error: null, loading: null });
    // Redirect will be handled by component that calls logout
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider value={{ state, login, logout, register, isAuthenticated, fetchUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };


