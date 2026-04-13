import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type {
  Credential,
  CredentialFormData,
  CredentialSummary,
} from "@/types/credential";
import type { Tables } from "@/types/database";

type CredentialRow = Tables<"credentials">;

async function encryptField(plainText: string): Promise<string> {
  const { data, error } = await supabase.rpc("encrypt_credential", {
    plain_text: plainText,
  });
  if (error) throw new Error(`暗号化に失敗しました: ${error.message}`);
  return data;
}

async function decryptField(cipherText: string): Promise<string> {
  const { data, error } = await supabase.rpc("decrypt_credential", {
    cipher_text: cipherText,
  });
  if (error) throw new Error(`復号に失敗しました: ${error.message}`);
  return data;
}

async function rowToCredential(row: CredentialRow): Promise<Credential> {
  const [password, pin] = await Promise.all([
    row.password_encrypted ? decryptField(row.password_encrypted) : null,
    row.pin_encrypted ? decryptField(row.pin_encrypted) : null,
  ]);

  return {
    id: row.id,
    user_id: row.user_id,
    service_name: row.service_name,
    account_id: row.account_id,
    password,
    pin,
    memo: row.memo,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useCredentials() {
  const { user } = useAuth();

  const listCredentials = async (): Promise<CredentialSummary[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from("credentials")
      .select("id, service_name, account_id, display_order, created_at")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  const listSharedCredentials = async (): Promise<CredentialSummary[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from("credentials")
      .select("id, service_name, account_id, display_order, created_at")
      .neq("user_id", user.id)
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  const getCredential = async (id: string): Promise<Credential> => {
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return await rowToCredential(data);
  };

  const createCredential = async (
    form: CredentialFormData,
  ): Promise<Credential> => {
    if (!user) throw new Error("ログインが必要です");

    const [passwordEncrypted, pinEncrypted] = await Promise.all([
      form.password.trim() ? encryptField(form.password.trim()) : null,
      form.pin.trim() ? encryptField(form.pin.trim()) : null,
    ]);

    const { data, error } = await supabase
      .from("credentials")
      .insert({
        user_id: user.id,
        service_name: form.service_name.trim(),
        account_id: form.account_id.trim() || null,
        password_encrypted: passwordEncrypted,
        pin_encrypted: pinEncrypted,
        memo: form.memo.trim() || null,
        display_order: 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return await rowToCredential(data);
  };

  const updateCredential = async (
    id: string,
    form: CredentialFormData,
  ): Promise<Credential> => {
    const [passwordEncrypted, pinEncrypted] = await Promise.all([
      form.password.trim() ? encryptField(form.password.trim()) : null,
      form.pin.trim() ? encryptField(form.pin.trim()) : null,
    ]);

    const { error } = await supabase
      .from("credentials")
      .update({
        service_name: form.service_name.trim(),
        account_id: form.account_id.trim() || null,
        password_encrypted: passwordEncrypted,
        pin_encrypted: pinEncrypted,
        memo: form.memo.trim() || null,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);

    return await getCredential(id);
  };

  const updateCredentialOrder = async (
    items: { id: string; display_order: number }[],
  ): Promise<void> => {
    const updates = items.map((item) =>
      supabase
        .from("credentials")
        .update({ display_order: item.display_order })
        .eq("id", item.id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
  };

  const deleteCredential = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("credentials")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  };

  return {
    listCredentials,
    listSharedCredentials,
    getCredential,
    createCredential,
    updateCredential,
    updateCredentialOrder,
    deleteCredential,
  };
}
