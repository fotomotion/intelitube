import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("__session");

  // Lista de rotas públicas
  const publicRoutes = ['/login', '/'];
  
  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Redirecionar para login se acessar rota protegida sem sessão
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirecionar para dashboard se acessar login com sessão
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',
    '/login',
    '/dashboard/:path*'
  ],
};