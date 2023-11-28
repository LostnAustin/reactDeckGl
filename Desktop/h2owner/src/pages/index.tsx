import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

// import styles from '../styles/Home.module.css'
// import '@/styles/globals.css'
import { usePicket } from '@picketapi/picket-react'
import { cookieName } from '../utils/supabase'

type Props = {
  loggedIn: boolean
}

export default function Home(props: Props) {
  const { loggedIn } = props
  const { login, logout, authState } = usePicket()
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    let auth = authState
    // no need to re-login if they've already connected with Picket
    if (!auth) {
      // login with Picket
      auth = await login()
    }

    // login failed
    if (!auth) return

    // create a corresponding supabase access token
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: auth.accessToken,
      }),
    })
    // redirect to their todos page
    router.push('/todos')
  }, [authState, login, router])

  const handleLogout = useCallback(async () => {
    // clear both picket and supabase session
    await logout()
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // refresh the page
    router.push('/')
  }, [logout, router])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loggedIn ? (
          <button onClick={handleLogout}>Log Out to Switch Wallets</button>
        ) : (
          <button onClick={handleLogin}>Log In with Your Wallet</button>
        )}
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  // get supabase token server-side
  const accessToken = req.cookies[cookieName]

  if (!accessToken) {
    return {
      props: {
        loggedIn: false,
      },
    }
  }

  return {
    props: {
      loggedIn: true,
    },
  }
}
