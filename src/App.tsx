import type { Session } from "@supabase/supabase-js";
import { Fragment, useEffect, useState } from "react";
import Login from "./components/login";
import Page1 from "./components/page-1";
import SignOut from "./components/sign-out";
import { supabaseClient } from "./supabase/supabase-client";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return session ? (
    <Fragment>
      <SignOut />
      <Page1 />
    </Fragment>
  ) : (
    <Login />
  );
}
