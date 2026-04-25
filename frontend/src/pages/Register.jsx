import { useState } from "react";
import { API } from "../api";

export default function Register() {
  const [form, setForm] = useState({});
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await API.post("/auth/send-otp", form);
      alert("OTP sent");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const register = async () => {
    try {
      const dobFormatted = form.dob.split("-").reverse().join("-"); // fix

      await API.post("/auth/verify-otp-register", {
        ...form,
        dob: dobFormatted,
        otp
      });

      alert("Registered ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>

      <input name="full_name" placeholder="Full Name" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="dob" type="date" onChange={handleChange} />

      {step === 1 && <button onClick={sendOtp}>Send OTP</button>}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={register}>Register</button>
        </>
      )}
    </div>
  );
}