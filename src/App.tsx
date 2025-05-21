import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { RepairJobsDashboard } from "./RepairJobsDashboard"; // Import the dashboard

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">Repair CRM</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4 md:p-8"> {/* Adjusted padding for content */}
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-full"> {/* Ensure loader is centered */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        {/* If loggedInUser is defined and not null, show the dashboard */}
        {loggedInUser && <RepairJobsDashboard />}
        {/* If loggedInUser is null (which means authenticated but no user record, unlikely with current auth setup but good practice) */}
        {!loggedInUser && (
          <div className="text-center">
             <p className="text-xl text-secondary">Welcome! Setting up your account...</p>
          </div>
        )}
      </Authenticated>
      <Unauthenticated>
        <div className="w-full max-w-md mx-auto mt-10"> {/* Centering and spacing for sign-in */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Repair CRM</h1>
            <p className="text-lg text-secondary">Sign in to manage your repair jobs.</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </>
  );
}
