// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/verifyemail";

  // Get the user token from cookies. This is correct for HTTP-only cookies.
  const token = request.cookies.get("userToken")?.value || "";
  
  // --- IMPORTANT LOGGING (keep these for debugging!) ---
  console.log(`--- Middleware Request ---`);
  console.log(`URL: ${request.url}`);
  console.log(`Pathname: ${path}`);
  console.log(`User Token (from cookie): ${token ? 'PRESENT' : 'NOT PRESENT'}`);
  if (token) console.log(`User Token Value (first 10 chars): ${token.substring(0, 10)}...`);
  console.log(`--------------------------`);
  // --- END IMPORTANT LOGGING ---

  // Scenario 1: User is authenticated and trying to access a public auth page
  if (isPublicPath && token) {
    // Redirect authenticated users from public auth pages to the home page
    console.log(`Middleware: Authenticated user on public path (${path}). Redirecting to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Scenario 2: User is NOT authenticated and trying to access a protected page
  if (!isPublicPath && !token) {
    // Redirect unauthenticated users from protected paths to the login page
    console.log(`Middleware: Unauthenticated user on protected path (${path}). Redirecting to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If neither of the above conditions is met, allow the request to proceed
  console.log(`Middleware: Allowing access to ${path}`);
  return NextResponse.next();
}
 
// Specify which paths the middleware should apply to.
// This ensures the middleware only runs for these specific routes,
// optimizing performance by not running on static assets or other unnecessary paths.
export const config = {
  matcher: [
    '/', // Home page
    '/add-to-product', // Protected product addition page
    '/update-product/:productId*', // Protected product update page (dynamic segment)
    '/login', // Public login page
    '/signup', // Public signup page
    '/profile', // Protected user profile page
    '/verifyemail', // Public email verification page
  ],
};
