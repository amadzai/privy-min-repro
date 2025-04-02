import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../components/Button";

const SimpleLoginButton = () => {
  const { ready, authenticated, login, logout } = usePrivy();

  // Show loading state if Privy isn't ready yet
  if (!ready) {
    return (
      <Button disabled className="opacity-70" variant="primary">
        Loading...
      </Button>
    );
  }

  // Show login button when not authenticated
  if (!authenticated) {
    return (
      <Button onClick={login} variant="primary">
        Login
      </Button>
    );
  }

  // Show logout button when authenticated
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-primary-foreground">Connected</span>
      <Button onClick={logout} variant="secondary">
        Logout
      </Button>
    </div>
  );
};

export default SimpleLoginButton;
