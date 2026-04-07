import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";

export function CitizenLogin() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const formatAadhaarInput = (value: string) =>
    value.replace(/\D/g, '').slice(0, 12);

  const getMaskedAadhaar = (aadhaar: string) =>
    aadhaar.length < 4 ? aadhaar : `XXXX-XXXX-${aadhaar.slice(-4)}`;

  // ================= SEND OTP =================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (aadhaarNumber.length !== 12) return setError("Enter valid 12-digit Aadhaar");
    if (phone.length !== 10) return setError("Enter valid 10-digit mobile number");
    if (mode === "register" && !name.trim()) return setError("Enter full name");

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/citizen/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaar: aadhaarNumber,
          name,
          phone,
          mode
        })
      });

      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to send OTP");
      else {
        setStep("otp");
        toast.success(`OTP sent to ${data.masked}`);
      }
    } catch {
      setError("Server not reachable");
    }
    setIsLoading(false);
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) return setError("Enter valid 6-digit OTP");

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/citizen/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar: aadhaarNumber, otp })
      });

      const data = await res.json();
      if (!res.ok) setError(data.message || "Invalid OTP");
      else {
        login({
          id: `citizen-${aadhaarNumber.slice(-4)}`,
          name: data.user.name,
          role: "citizen",
          aadhaarLast4: aadhaarNumber.slice(-4),
           aadhaar: aadhaarNumber 
        });
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        navigate("/citizen/dashboard");
      }
    } catch {
      setError("Server not reachable");
    }
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto max-w-md border-2">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Fingerprint className="h-8 w-8 text-success" />
        </div>
        <CardTitle className="text-2xl">Citizen Access</CardTitle>
        <CardDescription>Login or Register using Aadhaar & OTP</CardDescription>
      </CardHeader>

      <CardContent>
        {step === "aadhaar" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">

            {/* Mode Buttons */}
            <div className="flex gap-4">
              <Button type="button" variant={mode==="login"?"default":"outline"} onClick={()=>setMode("login")}>
                Login
              </Button>
              <Button type="button" variant={mode==="register"?"default":"outline"} onClick={()=>setMode("register")}>
                Register
              </Button>
            </div>

            {/* Aadhaar */}
            <div className="space-y-2">
              <Label>Aadhaar Number</Label>
              <Input value={aadhaarNumber} onChange={e=>setAadhaarNumber(formatAadhaarInput(e.target.value))} />
              <p className="text-sm">Display: {getMaskedAadhaar(aadhaarNumber)}</p>
            </div>

            {/* Name only for register */}
            {mode === "register" && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}

            {/* Phone */}
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} />
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Send className="mr-2" />} Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Alert>
              OTP sent to mobile linked with {getMaskedAadhaar(aadhaarNumber)}
            </Alert>

            <Input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} />

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2" />} Verify & Continue
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
