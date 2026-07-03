// Multi-user profiles: each profile gets its own persisted progress store, so
// two people (or one person on a shared device) never mix data. The active
// profile is chosen before the store initializes; switching reloads the app.

const ACTIVE_KEY = 'ca-pe-prep-active-profile';
const REGISTRY_KEY = 'ca-pe-prep-profiles';

export function getActiveProfile(): string {
  try {
    return localStorage.getItem(ACTIVE_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function listProfiles(): string[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    if (!arr.includes('default')) arr.unshift('default');
    return arr;
  } catch {
    return ['default'];
  }
}

export function createProfile(name: string): void {
  const clean = name.trim().replace(/[^\w\- ]/g, '').slice(0, 24);
  if (!clean) return;
  const all = listProfiles();
  if (!all.includes(clean)) {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify([...all, clean]));
  }
  switchProfile(clean);
}

export function switchProfile(name: string): void {
  localStorage.setItem(ACTIVE_KEY, name);
  // Full reload so the zustand persist store re-initializes on the new key.
  window.location.reload();
}

/** Storage key for a profile ('default' keeps the original key for back-compat). */
export function storageKeyFor(profile: string): string {
  return profile === 'default' ? 'ca-pe-prep-progress' : `ca-pe-prep-progress:${profile}`;
}

export function displayName(profile: string): string {
  return profile === 'default' ? 'Main' : profile;
}
