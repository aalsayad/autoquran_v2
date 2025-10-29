import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: Use proxy.ts for non-blocking tasks only (rewrites/redirects).
// No Supabase/network calls here.
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

// Limit proxy to a non-existent route to avoid overhead until needed
export const config = {
  matcher: ["/proxy-only"],
};


