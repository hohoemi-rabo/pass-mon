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

  const getMyShare = async (): Promise<FamilyShareInfo | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("family_shares")
      .select(
        "id, invite_code, status, created_at, shared_with:profiles!family_shares_shared_with_id_fkey(display_name)",
      )
      .eq("owner_id", user.id)
      .in("status", ["pending", "active"])
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      inviteCode: data.invite_code,
      status: data.status as ShareStatus,
      sharedWithName: data.shared_with?.display_name ?? null,
      createdAt: data.created_at,
    };
  };

  const getSharedFrom = async (): Promise<SharedFromInfo | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("family_shares")
      .select(
        "owner_id, owner:profiles!family_shares_owner_id_fkey(display_name)",
      )
      .eq("shared_with_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      ownerName: data.owner?.display_name ?? null,
      ownerId: data.owner_id,
    };
  };

  const createInvite = async (): Promise<FamilyShareInfo> => {
    if (!user) throw new Error("ログインが必要です");

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
    const { data, error } = await supabase
      .from("family_shares")
      .insert({
        owner_id: user.id,
        invite_code: inviteCode,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    return {
      id: data.id,
      inviteCode: data.invite_code,
      status: "pending",
      sharedWithName: null,
      createdAt: data.created_at,
    };
  };

  const acceptInvite = async (code: string): Promise<void> => {
    const { error } = await supabase.rpc("accept_family_invite", {
      code: code.trim().toUpperCase(),
    });
    if (error) throw new Error(error.message);
  };

  const revokeShare = async (shareId: string): Promise<void> => {
    const { error } = await supabase
      .from("family_shares")
      .delete()
      .eq("id", shareId);
    if (error) throw new Error(error.message);
  };

  return {
    getMyShare,
    getSharedFrom,
    createInvite,
    acceptInvite,
    revokeShare,
  };
}
