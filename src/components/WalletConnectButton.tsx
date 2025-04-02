import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./Button";

const SimpleLoginButton = () => {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) {
    return (
      <Button disabled className="opacity-70" variant="primary">
        Loading...
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button onClick={login} variant="primary">
        Login
      </Button>
    );
  }

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
