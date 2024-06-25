import { getSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/router'
import SettingsContext from './settings'
import Cookies from 'js-cookie';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [session, setSession] = React.useState(null)

    React.useEffect(() => {
      const fetchSession = async () => {
        const session = await getSession()
        if (!session) {
          router.push('/404')
        } else {
          if (SettingsContext.restApiUrl === '' || SettingsContext.vncApiUrl === '') {
            axios.post('/api/config/config').then((response) => {
              SettingsContext.restApiUrl = response.data.RESTAPI
              SettingsContext.vncApiUrl = response.data.WS_URL
              setSession(session)
              setLoading(false)
            });
          } else {
            setSession(session)
            setLoading(false)
          }
        }
      }
      fetchSession()

    }, [router])

    if (loading) {
      return null
    }
    SettingsContext.user = session.user
    SettingsContext.password = Cookies.get('pwd')

    return <WrappedComponent session={session} {...props} />
  }
}

export default withAuth
