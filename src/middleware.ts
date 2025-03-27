import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra đường dẫn có phải route admin không (trừ trang đăng nhập admin)
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/auth';
  
  // Kiểm tra nếu route là /favorites
  const isFavoritesRoute = pathname === '/favorites' || pathname.startsWith('/favorites/');
  
  // Lấy token từ cookie
  const token = request.cookies.get('token')?.value;
  
  // Lấy thông tin user từ cookie
  let user = null;
  try {
    const userString = request.cookies.get('user')?.value;
    if (userString) {
      user = JSON.parse(decodeURIComponent(userString));
    }
  } catch (error) {
    console.error('Error parsing user data', error);
  }
  
  // Nếu là route admin
  if (isAdminRoute) {
    // Nếu không có token hoặc user không phải admin, chuyển hướng đến trang đăng nhập admin
    if (!token || !user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/auth', request.url));
    }
  }
  
  // Nếu là route favorites
  if (isFavoritesRoute) {
    // Nếu không có token hoặc không có user, chuyển hướng đến trang đăng nhập
    if (!token || !user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Cập nhật matcher để áp dụng middleware cho cả route admin và route favorites
export const config = {
  matcher: ['/admin/:path*', '/favorites', '/favorites/:path*'],
}; 