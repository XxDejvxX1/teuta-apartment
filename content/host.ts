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
   * Optional. ONE photograph containing everyone in `names`, not one portrait
   * each — the block renders a single 144px circle, so a close square crop is
   * what survives at that size.
   *
   * Set back to `null` if the file is ever removed: null falls back to the
   * initials disc, whereas a path to a missing file renders broken.
   */
  photoSrc: "/photos/host.webp" as string | null,
};

export function hasHost(): boolean {
  return host.names.filter((name) => name.trim().length > 0).length > 0;
}
