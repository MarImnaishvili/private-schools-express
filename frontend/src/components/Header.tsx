"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

export default function Header() {
  const tG = useTranslations("General");
  const tAuth = useTranslations("auth");
  const { user, role, loading, signOut } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || "ka";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: Log the auth state
  console.log('Header auth state:', { user: !!user, role, loading });

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push(`/${locale}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white shadow-md z-50 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo + Desktop Navigation */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide flex items-center gap-1 md:gap-2">
            <span className="text-2xl md:text-3xl">🏫</span>
            <span className="hidden sm:inline">{tG("GeorgianPrivateSchools")}</span>
            <span className="sm:hidden">Schools</span>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
          <Link
            href={`/${locale}`}
            className="hover:text-blue-400 hover:cursor-pointer transition-colors"
          >
            {tG("Home")}
          </Link>
          <Link
            href={`/${locale}/schools`}
            className="hover:text-blue-400 hover:cursor-pointer transition-colors"
          >
            {tAuth("viewTable")}
          </Link>

          {!user && (
            <Link
              href={`/${locale}/login`}
              className="hover:text-blue-400 hover:cursor-pointer transition-colors"
            >
              {tAuth("signIn")}
            </Link>
          )}

          {user && (
            <>
              <Link
                href={`/${locale}/dashboard`}
                className="hover:text-blue-400 hover:cursor-pointer transition-colors"
              >
                {tAuth("dashboard")}
              </Link>

              {role === "admin" && (
                <Link
                  href={`/${locale}/admin/employees`}
                  className="hover:text-blue-400 hover:cursor-pointer transition-colors"
                >
                  {tAuth("employeeManagement")}
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="hover:text-blue-400 hover:cursor-pointer transition-colors"
              >
                {tAuth("signOut")}
              </button>
            </>
          )}
          </nav>
        </div>

        {/* Right side: User info (desktop) + Language + Hamburger */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* User info - desktop only */}
          {user && (
            <div className="hidden lg:flex items-center gap-3 text-sm">
              <div className="flex flex-col items-end">
                <span className="text-gray-300">{user.email}</span>
                {role && (
                  <span className="text-xs text-blue-400 capitalize">
                    {role}
                  </span>
                )}
              </div>
            </div>
          )}

          <LanguageSwitcher />

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            {/* User info - mobile */}
            {user && (
              <div className="pb-3 mb-3 border-b border-gray-700">
                <div className="text-sm text-gray-300">{user.email}</div>
                {role && (
                  <div className="text-xs text-blue-400 capitalize mt-1">
                    {role}
                  </div>
                )}
              </div>
            )}

            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-400 transition-colors"
            >
              {tG("Home")}
            </Link>
            <Link
              href={`/${locale}/schools`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-blue-400 transition-colors"
            >
              {tAuth("viewTable")}
            </Link>

            {!user && (
              <Link
                href={`/${locale}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-blue-400 transition-colors"
              >
                {tAuth("signIn")}
              </Link>
            )}

            {user && (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-blue-400 transition-colors"
                >
                  {tAuth("dashboard")}
                </Link>

                {role === "admin" && (
                  <Link
                    href={`/${locale}/admin/employees`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-blue-400 transition-colors"
                  >
                    {tAuth("employeeManagement")}
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="py-2 text-left hover:text-blue-400 transition-colors"
                >
                  {tAuth("signOut")}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
