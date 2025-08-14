// Scoped session state management for sandboxes and related data
import type { ConversationState } from './conversation';

export interface SandboxFile {
  content: string;
  lastModified: number;
}

export interface SandboxFileCache {
  files: Record<string, SandboxFile>;
  lastSync: number;
  sandboxId: string;
  // FileManifest type from file-manifest.ts
  manifest?: any;
}

export interface SandboxState {
  fileCache: SandboxFileCache | null;
  sandbox: any; // E2B sandbox instance
  sandboxData: {
    sandboxId: string;
    url: string;
  } | null;
}

export interface SessionState {
  activeSandbox: any;
  sandboxData: { sandboxId: string; url: string } | null;
  existingFiles: Set<string>;
  sandboxState: SandboxState;
  conversationState: ConversationState | null;
  viteErrors?: any[];
  viteErrorsCache?: { errors: any[]; timestamp: number } | null;
}

const sessionStore = new Map<string, SessionState>();

export function getSession(sessionId: string): SessionState {
  let session = sessionStore.get(sessionId);
  if (!session) {
    session = {
      activeSandbox: null,
      sandboxData: null,
      existingFiles: new Set<string>(),
      sandboxState: {
        fileCache: null,
        sandbox: null,
        sandboxData: null,
      },
      conversationState: null,
      viteErrors: [],
      viteErrorsCache: null,
    };
    sessionStore.set(sessionId, session);
  }
  return session;
}

export function deleteSession(sessionId: string) {
  sessionStore.delete(sessionId);
}
