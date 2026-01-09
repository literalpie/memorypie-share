import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { StrictMode } from "react";

import "./index.css";
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>
            <RouterProvider router={router} />
          </Authenticated>
          <Unauthenticated>
            <RouterProvider router={router} />
          </Unauthenticated>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
);
