/** Full anshin memo data (body is decrypted) */
export type AnshinMemo = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

/** Summary for list display (no body — encrypted) */
export type AnshinMemoSummary = {
  id: string;
  title: string;
  display_order: number;
  created_at: string;
};

/** Form input for creating/updating a memo */
export type AnshinMemoFormData = {
  title: string;
  body: string;
};
