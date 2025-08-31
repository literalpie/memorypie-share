import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./-index/SignInForm";
import { HomeContent } from "./-index/HomeContent";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-8 flex flex-col gap-16">
      <h1 className="text-4xl font-bold text-center">Memorypie Share</h1>
      <Authenticated>
        <HomeContent />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </main>
  );
}
