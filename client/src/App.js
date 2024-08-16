import { useState, useEffect } from 'react'

import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { PrimeReactProvider } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

import SunshadeControl from './SunshadeControl';

import 'primereact/resources/themes/lara-light-cyan/theme.css';

import supabaseConfig from './supabase.json';

const supabase = createClient(supabaseConfig.project_url, supabaseConfig.public_anon_key)

export default function App() {

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}} providers={[]} />)
  }

  return (
    <PrimeReactProvider>
      <Toolbar end={<Button label="Logout" onClick={() => supabase.auth.signOut()} />} />
      <SunshadeControl />
    </PrimeReactProvider>
  );
}
