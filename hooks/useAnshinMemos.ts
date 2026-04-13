import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type {
  AnshinMemo,
  AnshinMemoFormData,
  AnshinMemoSummary,
} from "@/types/anshinMemo";

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

export function useAnshinMemos() {
  const { user } = useAuth();

  const listAnshinMemos = async (): Promise<AnshinMemoSummary[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from("anshin_memos")
      .select("id, title, display_order, created_at")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  const listSharedAnshinMemos = async (): Promise<AnshinMemoSummary[]> => {
    if (!user) return [];
    const { data, error } = await supabase
      .from("anshin_memos")
      .select("id, title, display_order, created_at")
      .neq("user_id", user.id)
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  const getAnshinMemo = async (id: string): Promise<AnshinMemo> => {
    const { data, error } = await supabase
      .from("anshin_memos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);

    const body = await decryptField(data.body_encrypted);
    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      body,
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const createAnshinMemo = async (
    form: AnshinMemoFormData,
  ): Promise<AnshinMemo> => {
    if (!user) throw new Error("ログインが必要です");

    const bodyEncrypted = await encryptField(form.body.trim());

    const { data, error } = await supabase
      .from("anshin_memos")
      .insert({
        user_id: user.id,
        title: form.title.trim(),
        body_encrypted: bodyEncrypted,
        display_order: 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      body: form.body.trim(),
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const updateAnshinMemo = async (
    id: string,
    form: AnshinMemoFormData,
  ): Promise<AnshinMemo> => {
    const bodyEncrypted = await encryptField(form.body.trim());

    const { data, error } = await supabase
      .from("anshin_memos")
      .update({
        title: form.title.trim(),
        body_encrypted: bodyEncrypted,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      body: form.body.trim(),
      display_order: data.display_order,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const updateAnshinMemoOrder = async (
    items: { id: string; display_order: number }[],
  ): Promise<void> => {
    const updates = items.map((item) =>
      supabase
        .from("anshin_memos")
        .update({ display_order: item.display_order })
        .eq("id", item.id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
  };

  const deleteAnshinMemo = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("anshin_memos")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  };

  return {
    listAnshinMemos,
    listSharedAnshinMemos,
    getAnshinMemo,
    createAnshinMemo,
    updateAnshinMemo,
    updateAnshinMemoOrder,
    deleteAnshinMemo,
  };
}
