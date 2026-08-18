/**
 * Who the guest is actually dealing with.
 *
 * For a direct-booking site with no platform behind it, a name and a face is
 * the cheapest trust available — it is the main thing a stranger weighs before
 * messaging about money and travel dates. Two of the reviews on this page
 * praise "the host" by role; these are the names that belong to that word.
 *
 * The host block renders nothing while `names` is empty.
 */

export const host = {
  /** One or more first names. Joined with a locale-aware "and". */
  names: ["Dejv"] as string[],

  /**
   * ONE photograph containing everyone in `names`, not one portrait each — the
   * block renders a single circle, so a close square crop is what survives.
   *
   * This used to be nullable, falling back to a disc of initials when it was
   * unset. That was a stand-in from before there was a real photograph, and the
   * case it guarded against — the file going missing — is now caught by
   * scripts/audit/assets.mjs, which fails the build if any photograph the code
   * names is not on disk. A build that fails is better than a portrait that
   * quietly turns into a coloured circle.
   */
  photoSrc: "/photos/host.webp",
};

export function hasHost(): boolean {
  return host.names.filter((name) => name.trim().length > 0).length > 0;
}
