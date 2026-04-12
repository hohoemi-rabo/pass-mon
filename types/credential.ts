/** Decrypted credential as used by the UI layer */
export type Credential = {
  id: string;
  user_id: string;
  service_name: string;
  account_id: string | null;
  password: string | null;
  pin: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

/** Summary for list display (no sensitive data) */
export type CredentialSummary = {
  id: string;
  service_name: string;
  account_id: string | null;
  created_at: string;
};

/** Form input for creating/updating a credential */
export type CredentialFormData = {
  service_name: string;
  account_id: string;
  password: string;
  pin: string;
  memo: string;
};
