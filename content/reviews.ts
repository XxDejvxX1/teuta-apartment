/**
 * Guest reviews.
 *
 * Real ones only — copied word for word from Booking.com, with the guest's
 * real first name and score. An invented review is a fabricated record: it
 * misleads the guest, and in the EU it is also an unfair commercial practice
 * under the Consumer Rights Directive. Sites have been fined for it.
 *
 * Text is kept VERBATIM, typos and all. "Duress", "One pf the greatest" and the
 * emoji are the guests' own; correcting them would make the reviews read as
 * copy written in-house, which is exactly the impression they exist to defeat.
 *
 * Reviews are deliberately NOT translated. A guest's own words in their own
 * language read as real; a translated one reads as marketing.
 *
 * The block renders nothing while this array is empty.
 *
 * One constraint when adding more: on desktop the cards share a fixed height
 * (`.deck--reviews .deck-item` in globals.css), sized to the longest review
 * here with room to spare. A markedly longer one will have its last line
 * clipped, silently — raise that height if you add one.
 */

export type Review = {
  /** The guest's words, exactly as they wrote them. */
  text: string;
  /** First name only. */
  name: string;
  /** Where they came from, e.g. "Italy". Optional. */
  from?: string;
  /** Booking.com score out of 10. Optional. */
  score?: number;
  /** The headline the guest gave the review, if they gave one. */
  title?: string;
  /** When they stayed, e.g. "August 2025". Optional. */
  stayed?: string;
};

/** Booking.com scores are out of 10. */
export const SCORE_MAX = 10;

export const reviews: Review[] = [
  {
    name: "Diana",
    from: "UK",
    score: 10,
    title: "Exceptional",
    text: "We arrived late and the host waited for us to show us around. The place was very clean and the whole house was fully equipped- the kitchen had all the necessities which made it feel like a home away from home . The location was great: close to the sea and the restaurants. Restaurant prices are cheaper than buying foods at the supermarkets, and the local seafood is very tasty. Additionally, as we were leaving, the host recommended Tirana's restaurants and places worth visiting.",
  },
  {
    name: "Anca",
    from: "Romania",
    score: 9,
    title: "Ideal location for family vacations",
    text: "One pf the greatest and caring hosts we ever met!!! ❤️ available anytime, thank you again! We booked a 7 night trip with our 2 year old daughter. Everything was clean, comfy beds, great kitchen facilities, great views exactly on the beach, it is perfect for travelling with kids. Shops, restaurants, pharmacy in 2-5min walks. + we had the possibility to check in earlier with no extra cost",
  },
  {
    name: "Lisa",
    from: "Australia",
    score: 10,
    title: "Seaside Paradise",
    text: "We had the most relaxing holiday in Duress due to our very comfortable and well equipped apartment. The location of the property is fantastic!!! Close to everything you could possibly want or need. The view is a pleasure to wake to every morning.",
  },
  {
    name: "Andrew",
    from: "United Kingdom",
    score: 10,
    title: "Perfect apartment",
    text: "Well equipped apartment in a wonderful beachfront location. A real home from home with every facility you could possibly need.",
  },
  {
    name: "Yana",
    from: "Ukraine",
    score: 10,
    title: "Superb",
    text: "The apartment fully corresponds to the photo. Very beautiful and comfortable. there is a supermarket, a fruit stand and many restaurants within a 3-minute walk. The kitchen is equipped with everything. the apartment is very clean. Rudi is very pleasant to communicate with, can help with all questions. I highly recommend this accommodation. Unbelievable 😍",
  },
];
