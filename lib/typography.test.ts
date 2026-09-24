import { describe, it, expect } from "vitest";

import { keepTogether, keepHeadingsTogether } from "@/lib/typography";

const NB = " ";

/** The places a line is still allowed to break: after each ordinary space. */
const breakable = (text: string) => text.split(" ");

describe("keepTogether", () => {
  it("never lets a heading end a line on a short word", () => {
    expect(breakable(keepTogether("Good to know"))).toEqual(["Good", `to${NB}know`]);
    expect(breakable(keepTogether("Ask me about your dates"))).toEqual([
      "Ask",
      "me",
      "about",
      `your${NB}dates`,
    ]);
  });

  it("keeps a count with what it counts", () => {
    expect(breakable(keepTogether("2 sofa beds"))).toEqual([`2${NB}sofa`, "beds"]);
  });

  it("still breaks after punctuation", () => {
    // "it," ends a clause, so the line may end after it.
    expect(keepTogether("rate it, then")).toBe("rate it, then");
  });

  it("changes nothing but spaces", () => {
    const title = "One bedroom, one balcony, and the whole Adriatic in front of it.";
    expect(keepTogether(title).replaceAll(NB, " ")).toBe(title);
  });
});

describe("keepHeadingsTogether", () => {
  it("binds the words in a heading and leaves its attributes alone", () => {
    const html = '<h2 id="getting there">Getting there from the apartment</h2><p>from the town</p>';
    expect(keepHeadingsTogether(html)).toBe(
      `<h2 id="getting there">Getting there from${NB}the${NB}apartment</h2><p>from the town</p>`,
    );
  });
});
