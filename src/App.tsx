import type { Session } from "@supabase/supabase-js";
import { Fragment, useEffect, useState } from "react";
import Login from "./components/login";
import PageBroadcast from "./components/page-broadcast";
import PageDBTable from "./components/page-db-table";
import SignOut from "./components/sign-out";
import { supabaseClient } from "./supabase/supabase-client";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [page, setPage] = useState<number>(1);

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
      <button onClick={() => setPage(1)}>page-db-table</button>
      <button onClick={() => setPage(2)}>page-broadcast</button>
      {page === 1 ? <PageDBTable /> : page === 2 ? <PageBroadcast /> : null}
    </Fragment>
  ) : (
    <Login />
  );
}
