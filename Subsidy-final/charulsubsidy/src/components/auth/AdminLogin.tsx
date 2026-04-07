import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ADMIN_CREDENTIALS } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog, Loader2, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against fixed dummy credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      login({
        id: 'admin-001',
        name: 'System Administrator',
        role: 'admin',
        email: email,
      });
      toast.success("Admin login successful!");
      navigate('/admin/dashboard');
    } else {
      setError("Invalid credentials. Access denied.");
      toast.error("Access denied!");
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto max-w-md border-2">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <UserCog className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-heading text-2xl">Administrator Login</CardTitle>
        <CardDescription>
          Authorized personnel only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            <strong>Notice:</strong> Admin registration is not available. Only authorized administrators can access this portal.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@subsidyportal.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Login as Administrator
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
          <p className="font-medium text-muted-foreground">Demo Credentials:</p>
          <p className="text-xs text-muted-foreground mt-1">
            Email: admin@subsidyportal.gov.in<br />
            Password: Admin@123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
