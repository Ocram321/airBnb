//frontend/src/components/LoginFormPage/LoginFormPage.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const loginDemoUser = () => {
    return dispatch(sessionActions.login({
      credential: 'demo@user.io',
      password: 'password'
    }))
      .then(closeModal)
      .catch((err) => console.error('Error logging in as demo user:', err));
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <button
          onClick={() => loginDemoUser()}
        >
          Login as demo user
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;