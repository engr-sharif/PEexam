// Progress sync via a private GitHub Gist — no backend needed. The user
// supplies a fine-grained personal access token with ONLY the "gist" scope;
// it is stored in this browser's localStorage only (never exported, never
// sent anywhere except api.github.com).

import { getActiveProfile } from './profile';

const FILE_NAME = 'ca-pe-prep-progress.json';

function credKey(): string {
  return `ca-pe-prep-gist-cred:${getActiveProfile()}`;
}

export interface GistCred {
  token: string;
  gistId: string;
}

export function loadCred(): GistCred {
  try {
    return JSON.parse(localStorage.getItem(credKey()) ?? '') as GistCred;
  } catch {
    return { token: '', gistId: '' };
  }
}

export function saveCred(cred: GistCred): void {
  localStorage.setItem(credKey(), JSON.stringify(cred));
}

async function gh(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
}

/** Save progress JSON to a private gist. Returns the gist id (created if empty). */
export async function saveToGist(token: string, gistId: string, content: string): Promise<string> {
  const body = JSON.stringify({
    description: `CA PE/FE Prep progress backup (${getActiveProfile()}) — updated ${new Date().toISOString()}`,
    public: false,
    files: { [FILE_NAME]: { content } },
  });
  const res = gistId
    ? await gh(`/gists/${gistId}`, token, { method: 'PATCH', body })
    : await gh('/gists', token, { method: 'POST', body });
  if (!res.ok) {
    const msg = res.status === 401 ? 'Bad token' : res.status === 404 ? 'Gist not found (check ID / token scope)' : `GitHub error ${res.status}`;
    throw new Error(msg);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

/** Load progress JSON from the gist. */
export async function loadFromGist(token: string, gistId: string): Promise<string> {
  const res = await gh(`/gists/${gistId}`, token);
  if (!res.ok) {
    throw new Error(res.status === 404 ? 'Gist not found' : `GitHub error ${res.status}`);
  }
  const data = (await res.json()) as {
    files: Record<string, { content: string; truncated: boolean; raw_url: string }>;
  };
  const file = data.files[FILE_NAME];
  if (!file) throw new Error(`No ${FILE_NAME} in that gist`);
  if (!file.truncated) return file.content;
  const raw = await fetch(file.raw_url);
  return raw.text();
}
