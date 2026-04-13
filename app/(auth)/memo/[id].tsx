import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAnshinMemos } from "@/hooks/useAnshinMemos";
import { useAuth } from "@/hooks/useAuth";
import { confirmDialog } from "@/lib/platform";
import { Colors, Overlays } from "@/constants/theme";
import type { AnshinMemo, AnshinMemoFormData } from "@/types/anshinMemo";

function memoToForm(m: AnshinMemo): AnshinMemoFormData {
  return {
    title: m.title,
    body: m.body,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function AnshinMemoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { getAnshinMemo, updateAnshinMemo, deleteAnshinMemo } =
    useAnshinMemos();

  const [memo, setMemo] = useState<AnshinMemo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AnshinMemoFormData>({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getAnshinMemo(id);
        if (cancelled) return;
        setMemo(data);
        setEditForm(memoToForm(data));
      } catch (e) {
        if (cancelled) return;
        setLoadError(
          e instanceof Error ? e.message : "データの取得に失敗しました",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = (field: keyof AnshinMemoFormData, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && errors.title) {
      setErrors({});
    }
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) {
      setErrors({ title: "タイトルを入力してください" });
      return;
    }
    if (!id) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateAnshinMemo(id, editForm);
      setMemo(updated);
      setEditForm(memoToForm(updated));
      setIsEditing(false);
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "保存に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (memo) {
      setEditForm(memoToForm(memo));
    }
    setErrors({});
    setSaveError(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!id) return;
    const doDelete = async () => {
      try {
        await deleteAnshinMemo(id);
        setTimeout(() => router.back(), 50);
      } catch {
        if (Platform.OS === "web") {
          window.alert("削除に失敗しました。もう一度お試しください。");
        } else {
          import("react-native").then(({ Alert }) =>
            Alert.alert(
              "エラー",
              "削除に失敗しました。もう一度お試しください。",
            ),
          );
        }
      }
    };
    confirmDialog(
      "確認",
      "このメモを削除しますか？\nこの操作は取り消せません。",
      doDelete,
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (loadError || !memo) {
    return (
      <View
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top }}
      >
        <Header title="エラー" />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-body text-danger">
            {loadError ?? "データが見つかりませんでした"}
          </Text>
          <Button
            title="戻る"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const isOwner = memo.user_id === user?.id;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header
        title={isEditing ? "編集中" : memo.title}
        onBack={isEditing ? undefined : () => router.back()}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 40}
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-4 gap-5">
            {isEditing ? (
              <>
                <View>
                  <TextInput
                    label="タイトル"
                    placeholder="例：通帳の場所"
                    value={editForm.title}
                    onChangeText={(v) => updateField("title", v)}
                    autoCapitalize="none"
                  />
                  {errors.title ? (
                    <Text
                      className="mt-1 text-body"
                      style={{ color: Colors.danger }}
                    >
                      {errors.title}
                    </Text>
                  ) : null}
                </View>

                <TextInput
                  label="メモ"
                  placeholder="家族に伝えたいことを書いてください"
                  value={editForm.body}
                  onChangeText={(v) => updateField("body", v)}
                  multiline
                  numberOfLines={6}
                  style={{ height: 160, textAlignVertical: "top" }}
                />

                {saveError ? <ErrorBanner message={saveError} /> : null}

                <View className="mt-4 gap-3">
                  <Button
                    title={isSaving ? "保存中..." : "保存する"}
                    variant="primary"
                    onPress={handleSave}
                    disabled={isSaving}
                  />
                  <Button
                    title="キャンセル"
                    variant="secondary"
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                  />
                </View>
              </>
            ) : (
              <>
                <View className="gap-1">
                  <Text
                    className="text-text"
                    style={{ fontSize: 22, fontWeight: "700" }}
                  >
                    {memo.title}
                  </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-body text-text">{memo.body}</Text>
                </View>

                <Text style={{ fontSize: 16, color: Colors.subtext }}>
                  作成日: {formatDate(memo.created_at)}
                </Text>

                {isOwner ? (
                  <View className="mt-4 gap-3">
                    <Button
                      title="編集する"
                      variant="secondary"
                      onPress={() => setIsEditing(true)}
                    />
                    <Button
                      title="削除する"
                      variant="danger"
                      onPress={handleDelete}
                    />
                  </View>
                ) : (
                  <View
                    className="mt-4 rounded-button p-3"
                    style={{
                      backgroundColor: Overlays.secondaryLight,
                      borderWidth: 1,
                      borderColor: Overlays.secondaryBorder,
                    }}
                  >
                    <Text
                      className="text-center text-body"
                      style={{ color: Colors.secondary }}
                    >
                      閲覧のみ（家族共有）
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
