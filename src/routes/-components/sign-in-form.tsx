import { Button } from "#src/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export function SignInForm() {
  return (
    <div className="flex flex-col gap-4 w-full mx-auto p-4">
      <p>Sign in to create shared memorization items.</p>
      <SignInButton mode="modal">
        <Button>Sign in</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button>Sign up</button>
      </SignUpButton>
    </div>
  );
}
