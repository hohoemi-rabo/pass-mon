import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type {
  Credential,
  CredentialFormData,
  CredentialSummary,
} from "@/types/credential";
import type { Tables } from "@/types/database";

type CredentialRow = Tables<"credentials">;

async function encryptField(
  plainText: string,
): Promise<string> {
  const { data, error } = await supabase.rpc("encrypt_credential", {
    plain_text: plainText,
  });
  if (error) throw new Error(`暗号化に失敗しました: ${error.message}`);
  return data;
}

async function decryptField(
  cipherText: string,
): Promise<string> {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listCredentials = async (): Promise<CredentialSummary[]> => {
    if (!user) return [];
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("credentials")
        .select("id, service_name, account_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (fetchError) throw new Error(fetchError.message);
      return data;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "データの取得に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  /** List credentials shared by a family member (read-only) */
  const listSharedCredentials = async (): Promise<CredentialSummary[]> => {
    if (!user) return [];
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("credentials")
        .select("id, service_name, account_id, created_at")
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (fetchError) throw new Error(fetchError.message);
      return data;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "共有データの取得に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const getCredential = async (id: string): Promise<Credential> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("credentials")
        .select("*")
        .eq("id", id)
        .single();
      if (fetchError) throw new Error(fetchError.message);
      return await rowToCredential(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "データの取得に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const createCredential = async (
    form: CredentialFormData,
  ): Promise<Credential> => {
    if (!user) throw new Error("ログインが必要です");
    setIsLoading(true);
    setError(null);
    try {
      const [passwordEncrypted, pinEncrypted] = await Promise.all([
        form.password.trim() ? encryptField(form.password.trim()) : null,
        form.pin.trim() ? encryptField(form.pin.trim()) : null,
      ]);

      const { data, error: insertError } = await supabase
        .from("credentials")
        .insert({
          user_id: user.id,
          service_name: form.service_name.trim(),
          account_id: form.account_id.trim() || null,
          password_encrypted: passwordEncrypted,
          pin_encrypted: pinEncrypted,
          memo: form.memo.trim() || null,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      return await rowToCredential(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "データの保存に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredential = async (
    id: string,
    form: CredentialFormData,
  ): Promise<Credential> => {
    setIsLoading(true);
    setError(null);
    try {
      const [passwordEncrypted, pinEncrypted] = await Promise.all([
        form.password.trim() ? encryptField(form.password.trim()) : null,
        form.pin.trim() ? encryptField(form.pin.trim()) : null,
      ]);

      const { error: updateError } = await supabase
        .from("credentials")
        .update({
          service_name: form.service_name.trim(),
          account_id: form.account_id.trim() || null,
          password_encrypted: passwordEncrypted,
          pin_encrypted: pinEncrypted,
          memo: form.memo.trim() || null,
        })
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);

      return await getCredential(id);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "データの更新に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCredential = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("credentials")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "データの削除に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    listCredentials,
    listSharedCredentials,
    getCredential,
    createCredential,
    updateCredential,
    deleteCredential,
    isLoading,
    error,
  };
}
