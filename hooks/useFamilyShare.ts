import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export type ShareStatus = "none" | "pending" | "active";

export type FamilyShareInfo = {
  id: string;
  inviteCode: string;
  status: ShareStatus;
  sharedWithName: string | null;
  createdAt: string;
};

/** Info about sharing received from another user */
export type SharedFromInfo = {
  ownerName: string | null;
  ownerId: string;
};

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useFamilyShare() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Get the current user's outgoing share (as owner) */
  const getMyShare = async (): Promise<FamilyShareInfo | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("family_shares")
        .select(
          "id, invite_code, status, created_at, shared_with:profiles!family_shares_shared_with_id_fkey(display_name)",
        )
        .eq("owner_id", user.id)
        .in("status", ["pending", "active"])
        .maybeSingle();
      if (fetchError) throw new Error(fetchError.message);
      if (!data) return null;

      return {
        id: data.id,
        inviteCode: data.invite_code,
        status: data.status as ShareStatus,
        sharedWithName: data.shared_with?.display_name ?? null,
        createdAt: data.created_at,
      };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "共有情報の取得に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  /** Get info about who is sharing with the current user (as family member) */
  const getSharedFrom = async (): Promise<SharedFromInfo | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("family_shares")
        .select(
          "owner_id, owner:profiles!family_shares_owner_id_fkey(display_name)",
        )
        .eq("shared_with_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      if (fetchError) throw new Error(fetchError.message);
      if (!data) return null;

      return {
        ownerName: data.owner?.display_name ?? null,
        ownerId: data.owner_id,
      };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "共有情報の取得に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  /** Create a new invite (owner only, max 1) */
  const createInvite = async (): Promise<FamilyShareInfo> => {
    if (!user) throw new Error("ログインが必要です");
    setIsLoading(true);
    setError(null);
    try {
      // Check for existing active/pending share
      const { data: existing } = await supabase
        .from("family_shares")
        .select("id")
        .eq("owner_id", user.id)
        .in("status", ["pending", "active"])
        .maybeSingle();
      if (existing) {
        throw new Error("すでに招待が存在します。先に解除してください。");
      }

      const inviteCode = generateInviteCode();
      const { data, error: insertError } = await supabase
        .from("family_shares")
        .insert({
          owner_id: user.id,
          invite_code: inviteCode,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);

      return {
        id: data.id,
        inviteCode: data.invite_code,
        status: "pending",
        sharedWithName: null,
        createdAt: data.created_at,
      };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "招待の作成に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  /** Accept an invite code (family member) */
  const acceptInvite = async (code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc("accept_family_invite", {
        code: code.trim().toUpperCase(),
      });
      if (rpcError) throw new Error(rpcError.message);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "招待の受諾に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  /** Revoke a share (owner only) */
  const revokeShare = async (shareId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("family_shares")
        .delete()
        .eq("id", shareId);
      if (deleteError) throw new Error(deleteError.message);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "共有の解除に失敗しました";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMyShare,
    getSharedFrom,
    createInvite,
    acceptInvite,
    revokeShare,
    isLoading,
    error,
  };
}
