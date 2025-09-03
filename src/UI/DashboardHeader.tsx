"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/useAuth";
import { LogOut, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleHelp = () => {
    router.push("/help");
  };

  return (
    <>
      {/* Top border */}

      {/* Header content */}
      <div className="max-w-7xl bg-transparent mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo.png" alt="FHP Logo" width={32} height={32} />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">FHP Group</h1>
              </div>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleHelp}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
