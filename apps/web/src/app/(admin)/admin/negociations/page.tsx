import { auth } from "@/auth";
import { adminApiClient } from "@/lib/adminApiClient";
import { NegotiationQueue } from "@/components/admin/NegotiationQueue";
import type { AdminNegotiation } from "@/types/admin";

export default async function AdminNegotiationsPage() {
  const session = await auth();
  const negotiations = await adminApiClient.get<AdminNegotiation[]>(
    session!.apiToken,
    "/api/admin/negotiations?status=EN_ATTENTE"
  );

  return (
    <div>
      <h1 className="font-display text-3xl text-noir">Négociations en attente</h1>
      <p className="mt-2 text-sm text-anthracite/60">
        Prix proposés sous le plancher — validation manager requise avant acceptation.
      </p>
      <NegotiationQueue negotiations={negotiations} />
    </div>
  );
}
