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
  names: ["Rudi", "Dejv"] as string[],

  /**
   * Optional. Put a photo at `public/photos/host.jpg` and set this to
   * "/photos/host.jpg". Without one, the block shows initials — still better
   * than nobody, but a real photograph of the two of you does far more.
   */
  photoSrc: null as string | null,
};

export function hasHost(): boolean {
  return host.names.filter((name) => name.trim().length > 0).length > 0;
}
