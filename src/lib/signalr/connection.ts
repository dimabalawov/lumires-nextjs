import * as signalR from "@microsoft/signalr";
import { createClient } from "@/lib/supabase/client";

let connection: signalR.HubConnection | null = null;

export function getConnection() {
  if (connection) return connection;

  const supabase = createClient();
// const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const anon = process.env.SEED_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API = process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "http://localhost:58185";
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API}/hubs/notifications`, {
      accessTokenFactory: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? "";
      },
    })
    .withAutomaticReconnect()
    .build();

  return connection;
}