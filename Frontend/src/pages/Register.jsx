import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ...existing code...

const Register = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Replace this URL with your actual backend registration endpoint.
    const REGISTER_API_URL = "https://chat-gpt-clone-x4sk.onrender.com/api/auth/register";

    try {
      // Use axios.post to send the user's details to the backend.
      const response = await axios.post(
        REGISTER_API_URL,
        {
          email,
          fullname: {
            firstname,
            lastname,
          },
          password,
        },
        {
          withCredentials: true,
        }
      );

      // Log the successful response and navigate.
      console.log("Registration successful!", response.data);

      // On success, redirect to the home or login page.
      navigate("/");
    } catch (err) {
      // Handle different types of errors from the axios request.
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        setError(
          err.response.data.message || "Registration failed. Please try again."
        );
      } else if (err.request) {
        // The request was made but no response was received.
        setError("Network error. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an error.
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page--centered">
      <section className="card auth-card">
        {/* Theme toggle moved to global header */}
        <h2 className="card__title">Create account</h2>
        <form className="form" onSubmit={handleRegister}>
          <div className="form__row">
            <label className="form__label">
              <span className="form__labelText">First name</span>
              <input
                className="form__input"
                type="text"
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </label>

            <label className="form__label">
              <span className="form__labelText">Last name</span>
              <input
                className="form__input"
                type="text"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="form__label">
            <span className="form__labelText">Email</span>
            <input
              className="form__input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form__label">
            <span className="form__labelText">Password</span>
            <input
              className="form__input"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && (
          <p className="muted" style={{ color: "salmon" }}>
            {error}
          </p>
        )}
        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
