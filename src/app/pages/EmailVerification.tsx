import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../utils/supabase/client";

export function EmailVerification() {
  const { name } = useParams<{ name: string }>();
  const firstName = name || "user";

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: undefined },
      });
      if (error) throw error;
      setCodeSent(true);
      toast.success(`Verification code sent to ${email}! Check your inbox.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: "email",
      });
      if (error) throw error;
      localStorage.setItem("evata_user", JSON.stringify({ email, id: data.user?.id }));
      toast.success("Email verified successfully!");
      setTimeout(() => navigate(`/analysis/${firstName}`), 800);
    } catch (err: any) {
      toast.error(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!codeSent) handleSendCode();
      else handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140FF0]/5 to-[#EBF00F]/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#140FF0] rounded-full mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#140FF0] mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We'll send a one-time code to complete your analysis
          </p>
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg p-6"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSendCode}
              disabled={loading || !email}
              className="w-full bg-[#140FF0] hover:bg-[#0f0bc0] text-white py-6 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin" size={20} /> Sending...
                </span>
              ) : "Send Verification Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle size={20} />
                <span className="text-sm">Code sent to {email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">6-Digit Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={handleKeyDown}
                maxLength={6}
                className="text-lg p-6 text-center tracking-[0.5em] font-mono"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || loading}
              className="w-full bg-[#140FF0] hover:bg-[#0f0bc0] text-white py-6 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin" size={20} /> Verifying...
                </span>
              ) : "Verify & Continue"}
            </Button>
            <div className="flex justify-between text-sm mt-2">
              <button onClick={() => setCodeSent(false)} className="text-gray-500 hover:text-[#140FF0] transition-colors">
                Change email
              </button>
              <button onClick={handleSendCode} disabled={loading} className="text-[#140FF0] hover:underline disabled:opacity-50">
                Resend code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}