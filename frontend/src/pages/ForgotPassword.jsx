import { useState } from "react";
import { API } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const sendOtp = async () => {
    await API.post("/password/send-otp", { email });
    alert("OTP sent");
  };

  const reset = async () => {
    await API.post("/password/reset", {
      email,
      otp,
      newPassword: password
    });

    alert("Password changed");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Forgot Password</h3>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>

      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <input placeholder="New Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={reset}>Reset Password</button>
    </div>
  );
}