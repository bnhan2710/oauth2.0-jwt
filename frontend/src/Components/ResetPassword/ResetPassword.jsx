import "./resetPassword.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../redux/apiRequest";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const user = {
      username: username,
      newPassword: newPassword,
    };
    resetPassword(user, dispatch, navigate);
  };

  return (
    <section className="reset-password-container">
      <div className="reset-password-title">Reset Password</div>
      <form onSubmit={handleResetPassword}>
        <label>USERNAME</label>
        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>NEW PASSWORD</label>
        <input
          type="password"
          placeholder="Enter your new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>CONFIRM PASSWORD</label>
        <input
          type="password"
          placeholder="Confirm your new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </section>
  );
};

export default ResetPassword;
