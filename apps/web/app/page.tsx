import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { MarketingHome } from "../components/marketing-home";
import { authOptions } from "../lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.token) {
    redirect("/dashboard");
  }

  return <MarketingHome />;
}
