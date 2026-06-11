import * as signalR from "@microsoft/signalr";
import { createClient } from "@/lib/supabase/client";

let connection: signalR.HubConnection | null = null;

export function getConnection() {
  if (connection) return connection;

  const supabase = createClient();
  const API = process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "http://localhost:49320"; //DIMA change for api.supabase.win
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