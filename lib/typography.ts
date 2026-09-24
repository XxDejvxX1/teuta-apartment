/**
 * Keeps a heading from breaking in the wrong place.
 *
 * `text-wrap: balance` evens a heading's lines out, but it has no idea which
 * words belong together, so it will end a line on "to", "and" or "your":
 * "Good to / know", "Ask me about your / dates". This binds each short word to
 * the word after it with a no-break space, so a line can only end after a word
 * that can stand at the end of one.
 *
 * Display only. copy.json, the page titles and the JSON-LD keep plain spaces;
 * this runs where a heading is rendered.
 */

const SHORT = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "at",
  "by",
  "for",
  "as",
  "if",
  "is",
  "it",
  "its",
  "my",
  "your",
  "our",
  "with",
  "from",
  "into",
  "than",
  "one",
  "&",
]);

const NO_BREAK = " ";

/** A count belongs with what it counts: "2 sofa beds" never breaks after the 2. */
const binds = (word: string) => SHORT.has(word.toLowerCase()) || /^\d+$/.test(word);

export function keepTogether(text: string): string {
  const words = text.split(" ");
  return words
    .map((word, i) => {
      if (i === words.length - 1) return word;
      // Exact match only: "it," ends a clause, and a line may end after it.
      return word + (binds(word) ? NO_BREAK : " ");
    })
    .join("");
}

/**
 * The same, for the headings inside an article's rendered Markdown. Only the
 * text between tags is touched, so an attribute can never be rewritten.
 */
export function keepHeadingsTogether(html: string): string {
  return html.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g, (_, tag, attrs, inner: string) => {
    const text = inner
      .split(/(<[^>]+>)/)
      .map((part) => (part.startsWith("<") ? part : keepTogether(part)))
      .join("");
    return `<${tag}${attrs}>${text}</${tag}>`;
  });
}
