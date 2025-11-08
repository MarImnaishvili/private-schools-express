"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EmployeeRegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || "ka";
  const t = useTranslations("auth");
  const { role: currentUserRole, loading: authLoading } = useAuth();

  // Redirect if not admin - use useEffect to avoid updating during render
  useEffect(() => {
    if (!authLoading && currentUserRole !== "admin") {
      router.push(`/${locale}`);
    }
  }, [authLoading, currentUserRole, router, locale]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render form if not admin
  if (currentUserRole !== "admin") {
    return null;
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      setLoading(true);

      // Create user account using Supabase Admin API (via server action)
      const response = await fetch("/api/auth/create-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create employee");
      }

      toast.success(t("employeeCreated"));

      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("employee");
    } catch (error) {
      console.error("Error creating employee:", error);
      const errorMessage = error instanceof Error ? error.message : t("errorCreatingEmployee");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 px-4">
      <div className="max-w-2xl w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("createEmployee")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("employeeManagement")}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleCreateEmployee}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t("confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t("role")}
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "employee" | "admin")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="employee">{t("employee")}</option>
                <option value="admin">{t("admin")}</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("creatingEmployee") : t("createEmployee")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
