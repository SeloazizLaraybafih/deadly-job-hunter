'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      // save token
      localStorage.setItem('token', data.token)
      // go to dashboard
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  function toRegister() {
    router.push('/register')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand */}
        <div className='text-center flex'>
          <div className='inline-flex items-end justify-end rounded-xl mb-4'>
            <Image
              src='/images/sirjobsir-squid-front.png'
              alt='Logo'
              width={150}
              height={150}
              priority
              className='max-[321px]:w-24'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <h1 className='max-[321px]:text-sm text-xl sm:text-3xl font-bold text-foreground mb-2'>
              Login here buddy
            </h1>
          </div>
        </div>

        {/* Login Form */}
        <div className='bg-card border border-border rounded-2xl p-8 shadow-lg'>
          <form onSubmit={handleLogin} className='space-y-6'>
            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-card-foreground block'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='needwork@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 bg-input border border-border rounded-lg placeholder:text-xs sm:placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-card-foreground block'
                >
                  Password
                </label>
              </div>
              <input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 bg-input border border-border rounded-lg placeholder:text-xs sm:placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
              />
            </div>

            {error && (
              <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-3'>
                <p className='text-sm text-destructive'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gray-400 cursor-pointer hover:bg-gray-500 text-primary-foreground font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              {"Don't have an account? "}
              <button
                onClick={toRegister}
                className='cursor-pointer text-primary hover:text-primary/80 font-medium transition-colors'
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-muted-foreground'>
            By continuing, you agree to our{' '}
            <button className='text-primary hover:text-primary/80 transition-colors'>
              Terms of Service
            </button>{' '}
            and{' '}
            <button className='text-primary hover:text-primary/80 transition-colors'>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
