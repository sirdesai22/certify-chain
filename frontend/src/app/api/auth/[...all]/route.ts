import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ROLE_REDIRECTS: Record<string, string> = {
  student: '/student',
  institution: '/institution',
  employer: '/employer/verify',
  admin: '/admin/analytics',
}

const DEFAULT_REDIRECT = '/'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser()

      if (getUserError || !user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching user profile:', profileError.message)
      }

      if (!profile || profileError) {
        return NextResponse.redirect(new URL(`/onboarding/${user.role}`, request.url))
      }

      const destination =
        (profile.role ? ROLE_REDIRECTS[profile.role] : undefined) ??
        next ??
        DEFAULT_REDIRECT

      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth/signin', request.url))
}