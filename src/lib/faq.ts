import { site, giveaway } from "@/lib/config";
import { formatCents } from "@/lib/entries";

export const faq = [
  {
    q: "Is this legit? How do I know the car gets given away?",
    a: `The drawing is conducted under our Official Rules on ${new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} using a certified random selection, and the winner is announced publicly (with their permission) on this site and our socials. The prize — the ${giveaway.car.year} ${giveaway.car.name} or the ${formatCents(giveaway.cashAlternativeCents)} cash alternative — is guaranteed to be awarded. The full legal framework is in the Official Rules.`,
  },
  {
    q: "How do entries work?",
    a: "Each entry package instantly adds the stated number of entries to your email address. Buy multiple times and your entries stack automatically. Every entry is one ticket in the draw — more entries, better odds. You can check your total anytime on the My Entries page.",
  },
  {
    q: "Can I enter for free?",
    a: "Yes — no purchase is ever necessary. A free mail-in entry method is described in the Official Rules (hand-printed card, one per stamped envelope, one per person per day). Mailed entries carry the same per-entry odds as purchased entries.",
  },
  {
    q: "Who can enter?",
    a: giveaway.eligibility + " Employees of the sponsor and their household members are not eligible.",
  },
  {
    q: "What exactly does the winner get?",
    a: `The ${giveaway.car.headline} (ARV ${formatCents(giveaway.arvCents)}) plus ${formatCents(giveaway.taxContributionCents)} toward taxes — or, at the winner's choice, ${formatCents(giveaway.cashAlternativeCents)} in cash instead. Transport of the vehicle within the contiguous US is covered. Taxes beyond the tax contribution are the winner's responsibility (it's real income — plan for it).`,
  },
  {
    q: "How is the winner chosen and notified?",
    a: "One winning entry is drawn at random from all valid entries (paid and free combined). The winner is notified by email and phone within 48 hours and has 7 days to respond before an alternate is drawn. Full procedure is in the Official Rules.",
  },
  {
    q: "Are entries refundable?",
    a: `Entry package purchases are final and non-refundable once entries are issued, except where required by law. If you have any problem with an order, email ${site.supportEmail} and a human will sort it out.`,
  },
];
