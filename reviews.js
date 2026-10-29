// Client feedback shown on the Gallery page "wall of trust".
//
// IMPORTANT: the entries marked `sample: true` are placeholder reviews written
// for the design stage. They are NOT from real clients. They are hidden
// automatically on the live mukondeleli domain, so the section only shows there
// once real reviews are added. Replace them with real reviews or comments
// copied from Mukondeleli's social pages, then delete the samples.
//
// Fields:
//   name      person's name as shown on the platform
//   role      optional, e.g. "Event organiser" or "Estate manager, Pretoria"
//   platform  "facebook" | "google" | "instagram" | "tiktok" | "linkedin"
//   rating    1-5 for star reviews, or null for comments without a rating
//   text      the review or comment, word for word
//   date      optional, e.g. "October 2026"
//   photo     optional path to a profile picture, e.g. "images/reviews/jane.jpg"
//   link      optional URL of the original post or review
//   sample    true only for placeholder reviews
window.MPS_REVIEWS = [
  {
    name: 'Thandeka M.',
    role: 'Event organiser, Pretoria',
    platform: 'facebook',
    rating: 5,
    text: 'Mukondeleli handled security for our community day and everything ran smoothly from setup to pack-down. The officers were on time, well briefed and friendly with our guests.',
    date: 'October 2026',
    sample: true
  },
  {
    name: 'Johan V.',
    role: 'Estate manager',
    platform: 'google',
    rating: 5,
    text: 'Professional team at our gate. Visitor control is much tighter since they took over and the supervisor actually answers the phone at 2am.',
    date: 'September 2026',
    sample: true
  },
  {
    name: 'lerato_k',
    role: 'Instagram comment',
    platform: 'instagram',
    rating: null,
    text: 'Saw the MPS team at the Pretoria event last weekend. So organised and helpful with the elderly guests 👏🏾',
    date: 'October 2026',
    sample: true
  },
  {
    name: 'Sipho N.',
    role: 'Retail store owner',
    platform: 'google',
    rating: 4,
    text: 'Reliable guards and good communication from management. Reports come through every morning, which gives me peace of mind.',
    date: 'August 2026',
    sample: true
  },
  {
    name: 'Naledi D.',
    role: 'Corporate client',
    platform: 'facebook',
    rating: 5,
    text: 'We used Mukondeleli for a corporate function with over 400 guests. Access control at the entrance was quick and respectful. Will definitely book again.',
    date: 'July 2026',
    sample: true
  },
  {
    name: 'mpho.sec',
    role: 'TikTok comment',
    platform: 'tiktok',
    rating: null,
    text: 'Proud to see a Black-owned security company doing it this professionally. Keep growing MPS!',
    date: 'June 2026',
    sample: true
  }
];
