"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/lib/stores/authstore';
import Image from "next/image";

export function PublicHeader() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="border-b">
      <div className="max-w-175 mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Mount Blog 
        </Link>

        <nav className="flex items-center gap-2">
          {
            isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Logout</Link>
                </Button>
              </>
            ) :
              (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/registration">Sign Up</Link>
                  </Button>
                </>
              )
          }
        </nav>
      </div>
    </header>
  )
}