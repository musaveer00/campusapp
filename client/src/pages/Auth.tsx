import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2, UserCircle, KeyRound } from "lucide-react";

export default function AuthPage() {
  const { login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  const prefill = (userType: 'admin' | 'student' | 'teacher') => {
    setUsername(userType);
    setPassword(`${userType}123`);
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col items-center justify-center text-primary-foreground p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40"></div>
        
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-md mb-8 ring-1 ring-white/20 shadow-2xl">
            <GraduationCap className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">Campus Administration System</h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            A comprehensive platform connecting students and teachers. Manage attendance, grades, syllabuses, and more in one unified portal.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">CampusApp</h1>
          </div>

          <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="username" 
                      placeholder="Enter your username" 
                      className="pl-10 h-12 bg-background/50 focus:bg-background transition-colors"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-10 h-12 bg-background/50 focus:bg-background transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>
                  ) : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-border/50 pt-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">Demo Credentials:</p>
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline" size="sm" onClick={() => prefill('admin')} className="text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
                  Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => prefill('teacher')} className="text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
                  Teacher
                </Button>
                <Button variant="outline" size="sm" onClick={() => prefill('student')} className="text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors">
                  Student
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
