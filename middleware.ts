import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isTeacher } from "@/lib/teacher"

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing(.*)',
  '/api/webhook',
  '/v1/oauth_callback(.*)',
])

const isTeacherRoute = createRouteMatcher([
  '/teacher(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // اول چک میکنیم کاربر لاگین هست
    const session = await auth.protect()
    
    // بعد چک میکنیم اگه روت مخصوص معلم هست، کاربر باید معلم باشه
    if (isTeacherRoute(request)) {
      if (!isTeacher(session.userId)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}