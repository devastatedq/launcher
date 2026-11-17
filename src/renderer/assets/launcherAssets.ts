export interface LauncherAssets {
  mainFrame?: string;
  authPanel?: string;
  logo?: string;
  avatarFrame?: string;
  buttonRed?: string;
  buttonDark?: string;
  nav?: string;
  navActive?: string;
  playFrame?: string;
  newsArt: (string | undefined)[];
}

interface Slot {
  key: keyof Omit<LauncherAssets, 'newsArt'>;
  rel: string;
  cssVar?: string;
}

const SLOTS: Slot[] = [
  { key: 'mainFrame', rel: 'frames/main-frame.png', cssVar: '--asset-main-frame' },
  { key: 'authPanel', rel: 'frames/auth-panel.png', cssVar: '--asset-auth-panel' },
  { key: 'logo', rel: 'logos/trimira.png' },
  { key: 'avatarFrame', rel: 'icons/avatar-frame.png', cssVar: '--asset-avatar-frame' },
  { key: 'buttonRed', rel: 'ui/button-red.png', cssVar: '--asset-button-red' },
  { key: 'buttonDark', rel: 'ui/button-dark.png', cssVar: '--asset-button-dark' },
  { key: 'nav', rel: 'ui/nav.png', cssVar: '--asset-nav' },
  { key: 'navActive', rel: 'ui/nav-active.png', cssVar: '--asset-nav-active' },
  { key: 'playFrame', rel: 'ui/play-frame.png', cssVar: '--asset-play-frame' },
];

async function loadOne(rel: string): Promise<string | undefined> {
  if (!window.electron) return undefined;
  try {
    const res = await window.electron.invoke('assets:load', rel);
    return typeof res === 'string' && res.startsWith('data:') ? res : undefined;
  } catch {
    return undefined;
  }
}

export async function loadLauncherAssets(): Promise<LauncherAssets> {
  const result: LauncherAssets = { newsArt: [] };

  await Promise.all(
    SLOTS.map(async (slot) => {
      const url = await loadOne(slot.rel);
      if (!url) return;
      result[slot.key] = url;
      if (slot.cssVar) {
        document.documentElement.style.setProperty(slot.cssVar, `url("${url}")`);
      }
    })
  );

  result.newsArt = await Promise.all(
    [1, 2, 3].map((i) => loadOne(`news/news-${i}.png`))
  );

  return result;
}
