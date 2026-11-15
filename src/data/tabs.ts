// The site's sections, as the navbar shows them (Header.astro).
//
// Desktop: links that scroll the single story page, with the current section
// highlighted as you go. Phones: real tabs; only the active panel is laid out
// so a visitor reaches the essentials without a 24-screen scroll (NOTES.md,
// "Mobile tabs"). Panel ids double as URL fragments (/#cottage), so a tab is
// deep-linkable and survives a refresh. The first tab is the default and is
// server-rendered as the active panel.
//
// Inquire is deliberately NOT a tab: the form sits below whichever panel is
// open, at the end of every scroll, and the navbar's Inquire control is an
// anchor to it.
export interface StoryTab {
  /** Panel element id and URL fragment. */
  id: string;
  /** Short label, sized to fit five tabs across a 360px screen. */
  label: string;
}

export const storyTabs: StoryTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'cottage', label: 'Cottage' },
  { id: 'area', label: 'Area' },
  { id: 'host', label: 'Host' },
];

export const defaultTab = storyTabs[0].id;
