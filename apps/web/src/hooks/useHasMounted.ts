import { useEffect, useState } from "react";

/**
 * Garde d'hydratation : le store panier (zustand/persist) lit localStorage,
 * indisponible côté serveur. On rend "vide" au premier rendu serveur puis
 * on resynchronise une seule fois après montage côté client.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client/server hydration sync, not a render loop
    setMounted(true);
  }, []);
  return mounted;
}
