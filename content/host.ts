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
   * Optional. ONE photograph with everyone in `names` in it — not one portrait
   * each. The block renders a single 144px circle, so a close crop of the two
   * of you together is what works; a wide shot loses the faces at that size.
   *
   * Drop the file at `public/photos/host.jpg`, then change this line to
   * "/photos/host.jpg". Left null deliberately until the file exists: a missing
   * image renders broken, whereas null falls back to the initials disc.
   */
  photoSrc: null as string | null,
};

export function hasHost(): boolean {
  return host.names.filter((name) => name.trim().length > 0).length > 0;
}
