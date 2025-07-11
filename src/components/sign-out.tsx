import { supabaseClient } from "../supabase/supabase-client";

export default function SignOut() {
  return (
    <button
      style={{ width: "100%" }}
      onClick={() => supabaseClient.auth.signOut()}
    >
      Sign out
    </button>
  );
}
