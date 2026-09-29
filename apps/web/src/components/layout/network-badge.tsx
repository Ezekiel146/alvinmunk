import Link from 'next/link';
import { cn } from '@/lib/utils';

export type StellarNetwork = 'mainnet' | 'testnet';

/**
 * Resolve the active Stellar network from the public env.
 *
 * Reads `NEXT_PUBLIC_STELLAR_NETWORK` **directly** — not through `lib/stellar.ts`
 * — so the Stellar SDK never gets pulled into the marketing bundle for the sake
 * of a label. Normalisation mirrors `config/csp.mjs` / `readNetworkConfig`:
 * default to testnet, and treat the value as mainnet only when it is exactly
 * `"mainnet"` (trimmed, case-insensitive).
 */
export function resolveNetwork(
  raw: string | undefined = process.env.NEXT_PUBLIC_STELLAR_NETWORK,
): StellarNetwork {
  return raw !== undefined && raw.trim().toLowerCase() === 'mainnet' ? 'mainnet' : 'testnet';
}

/**
 * A pill that states which Stellar network the app is pointed at, linking to
 * `/api/health` for live status. Testnet and mainnet differ in **text** (not
 * colour alone) so they are never confused: an amber "Testnet · test funds" vs a
 * distinct green "Mainnet". Rendered in both the navbar and the footer.
 */
export function NetworkBadge({ className }: { className?: string }) {
  const isMainnet = resolveNetwork() === 'mainnet';
  const label = isMainnet ? 'Mainnet' : 'Testnet · test funds';

  return (
    <Link
      href="/api/health"
      aria-label={`Network: ${isMainnet ? 'Mainnet' : 'Testnet'} — view status`}
      title="View network status"
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        isMainnet
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300',
        className,
      )}
      data-network={isMainnet ? 'mainnet' : 'testnet'}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full', isMainnet ? 'bg-emerald-500' : 'bg-amber-500')}
      />
      {label}
    </Link>
  );
}
