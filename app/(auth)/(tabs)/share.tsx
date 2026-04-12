import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ErrorBanner } from "@/components/ErrorBanner";
import {
  useFamilyShare,
  type FamilyShareInfo,
  type SharedFromInfo,
} from "@/hooks/useFamilyShare";
import { confirmDialog } from "@/lib/platform";
import { Colors, Overlays } from "@/constants/theme";

export default function ShareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    getMyShare,
    getSharedFrom,
    createInvite,
    acceptInvite,
    revokeShare,
  } = useFamilyShare();

  const [myShare, setMyShare] = useState<FamilyShareInfo | null>(null);
  const [sharedFrom, setSharedFrom] = useState<SharedFromInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [share, from] = await Promise.all([
          getMyShare(),
          getSharedFrom(),
        ]);
        setMyShare(share);
        setSharedFrom(from);
      } catch {
        // Initial load failure is non-critical; user can retry
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateInvite = async () => {
    setActionError(null);
    setIsActionLoading(true);
    try {
      const share = await createInvite();
      setMyShare(share);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "招待の作成に失敗しました",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShareLink = async () => {
    if (!myShare) return;
    try {
      await Share.share({
        message: `パスもんで家族共有の招待です。\n招待コード: ${myShare.inviteCode}\n\nアプリをインストールして、共有設定画面からこのコードを入力してください。`,
      });
    } catch {
      // user cancelled share
    }
  };

  const handleRevoke = () => {
    if (!myShare) return;
    confirmDialog(
      "共有を解除",
      "家族との共有を解除しますか？\n相手はあなたのアカウント情報を閲覧できなくなります。",
      async () => {
        setActionError(null);
        try {
          await revokeShare(myShare.id);
          setMyShare(null);
        } catch (e) {
          setActionError(
            e instanceof Error ? e.message : "共有の解除に失敗しました",
          );
        }
      },
    );
  };

  const handleAcceptInvite = async () => {
    if (!inviteInput.trim()) return;
    setActionError(null);
    setIsActionLoading(true);
    try {
      await acceptInvite(inviteInput);
      setInviteInput("");
      const from = await getSharedFrom();
      setSharedFrom(from);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "招待の受諾に失敗しました",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header title="家族共有" />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="mt-4 gap-6">
          <View className="gap-3">
            <Text className="text-title font-semibold text-text">
              あなたの共有設定
            </Text>
            <Text className="text-body text-subtext">
              もしもの時に家族があなたのアカウント情報を閲覧できるようにします。
            </Text>

            {myShare ? (
              <ShareStatusCard
                share={myShare}
                isLoading={isActionLoading}
                onShare={handleShareLink}
                onRevoke={handleRevoke}
              />
            ) : (
              <Button
                title="家族を招待する"
                variant="primary"
                onPress={handleCreateInvite}
                disabled={isActionLoading}
              />
            )}
          </View>

          <View
            className="h-px"
            style={{ backgroundColor: Colors.border }}
          />

          <View className="gap-3">
            <Text className="text-title font-semibold text-text">
              家族から共有を受ける
            </Text>

            {sharedFrom ? (
              <Card>
                <View className="flex-row items-center gap-3">
                  <Ionicons
                    name="people"
                    size={28}
                    color={Colors.success}
                  />
                  <View className="flex-1">
                    <Text className="text-body font-semibold text-text">
                      共有中
                    </Text>
                    <Text className="text-body text-subtext">
                      {sharedFrom.ownerName ?? "ユーザー"}
                      さんのアカウント情報を閲覧できます
                    </Text>
                  </View>
                </View>
              </Card>
            ) : (
              <View className="gap-3">
                <Text className="text-body text-subtext">
                  招待コードを入力して、家族のアカウント情報を閲覧できるようにします。
                </Text>
                <TextInput
                  label="招待コード"
                  placeholder="例: ABC123"
                  value={inviteInput}
                  onChangeText={setInviteInput}
                  autoCapitalize="characters"
                />
                <Button
                  title={isActionLoading ? "処理中..." : "招待を受ける"}
                  variant="secondary"
                  onPress={handleAcceptInvite}
                  disabled={isActionLoading || !inviteInput.trim()}
                />
              </View>
            )}
          </View>

          {actionError ? <ErrorBanner message={actionError} /> : null}

          <View className="mt-2">
            <Button
              title="戻る"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ShareStatusCard({
  share,
  isLoading,
  onShare,
  onRevoke,
}: {
  share: FamilyShareInfo;
  isLoading: boolean;
  onShare: () => void;
  onRevoke: () => void;
}) {
  const isPending = share.status === "pending";

  return (
    <Card>
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <Ionicons
            name={isPending ? "time-outline" : "checkmark-circle"}
            size={28}
            color={isPending ? Colors.primary : Colors.success}
          />
          <View className="flex-1">
            <Text className="text-body font-semibold text-text">
              {isPending ? "招待中" : "共有中"}
            </Text>
            <Text className="text-body text-subtext">
              {isPending
                ? "家族がまだ招待を受けていません"
                : `${share.sharedWithName ?? "家族"}さんと共有中`}
            </Text>
          </View>
        </View>

        <View
          className="rounded-button p-3"
          style={{
            backgroundColor: Colors.cardElevated,
            borderWidth: 1,
            borderColor: Overlays.primaryLight,
          }}
        >
          <Text
            className="text-center text-title font-semibold tracking-widest"
            style={{ color: Colors.primary }}
          >
            {share.inviteCode}
          </Text>
        </View>

        <View className="gap-2">
          {isPending ? (
            <Button
              title="LINEやメールで共有"
              variant="primary"
              onPress={onShare}
              disabled={isLoading}
            />
          ) : null}
          <Button
            title="共有を解除する"
            variant="danger"
            onPress={onRevoke}
            disabled={isLoading}
          />
        </View>
      </View>
    </Card>
  );
}
