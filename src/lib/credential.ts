export const CREDENTIAL_TYPES = ["app", "web", "other"] as const;

export type CredentialTargetType = (typeof CREDENTIAL_TYPES)[number];

type CredentialTarget =
  | { type: "app"; path: string }
  | { type: "web"; url: string }
  | { type: "other"; name: string };

export interface Credential {
  id: string;
  name: string;
  identifier: string; // email, username, phone, document, api key
  target: CredentialTarget;
  iconPath?: string;
  createdAt: number;
  updatedAt: number;
}
