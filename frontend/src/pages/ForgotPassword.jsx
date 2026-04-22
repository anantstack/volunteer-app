import { useState } from "react";
import { API } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const sendOtp = async () => {
    try {
      const res = await API.post("/password/send-otp", { email });
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("OTP send failed");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await API.post("/password/reset-password", {
        email,
        otp,
        password
      });

      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Reset failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Forgot Password</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={sendOtp}>Send OTP</button>

      <input
        placeholder="OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />

      <input
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
}