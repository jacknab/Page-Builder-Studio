import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import { isLoggedIn } from "@/lib/auth";

const queryClient = new QueryClient();

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return <Component />;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  if (isLoggedIn()) {
    return <Redirect to="/app" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={() => <PublicOnlyRoute component={Login} />} />
      <Route path="/signup" component={() => <PublicOnlyRoute component={Signup} />} />
      <Route path="/onboarding" component={() => <PrivateRoute component={Onboarding} />} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/admin" component={() => <PrivateRoute component={Admin} />} />
      <Route path="/app" component={() => <PrivateRoute component={Home} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
