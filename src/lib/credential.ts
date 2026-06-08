type CredentialTarget =
  | { type: "web"; url: string }
  | { type: "app"; path: string }
  | { type: "other"; name: string };

export interface Credential {
  id: string;
  name: string;
  username: string;
  target: CredentialTarget;
  createdAt: number;
  updatedAt: number;
}
