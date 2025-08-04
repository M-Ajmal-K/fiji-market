"use client";

import { useAuth } from "@/components/auth-provider";   // ← fixed import
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const { user, signOut } = useAuth();

  if (!hydrated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <Button onClick={signOut} className="mt-4">Sign Out</Button>
      </div>
    </ProtectedRoute>
  );
}
