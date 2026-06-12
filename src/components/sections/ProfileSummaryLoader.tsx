import { getProfileSummary } from "@/lib/api/users";
import AtAGlanceCard from "./AtAGlanceCard";

export default async function ProfileSummaryLoader({ username }: { username: string }) {
  const stats = await getProfileSummary(username);
  return <AtAGlanceCard stats={stats} />;
}
