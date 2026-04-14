import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { PasswordField } from "@/components/PasswordField";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useCredentials } from "@/hooks/useCredentials";
import { useAuth } from "@/hooks/useAuth";
import { confirmDialog } from "@/lib/platform";
import { Colors, Overlays } from "@/constants/theme";
import type { Credential, CredentialFormData } from "@/types/credential";

function credentialToForm(c: Credential): CredentialFormData {
  return {
    service_name: c.service_name,
    account_id: c.account_id ?? "",
    password: c.password ?? "",
    pin: c.pin ?? "",
    memo: c.memo ?? "",
  };
}

export default function CredentialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { getCredential, updateCredential, deleteCredential } =
    useCredentials();

  const [credential, setCredential] = useState<Credential | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CredentialFormData>({
    service_name: "",
    account_id: "",
    password: "",
    pin: "",
    memo: "",
  });
  const [errors, setErrors] = useState<{ service_name?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getCredential(id);
        if (cancelled) return;
        setCredential(data);
        setEditForm(credentialToForm(data));
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

  const updateField = (field: keyof CredentialFormData, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (field === "service_name" && errors.service_name) {
      setErrors({});
    }
  };

  const handleSave = async () => {
    if (!editForm.service_name.trim()) {
      setErrors({ service_name: "サービス名を入力してください" });
      return;
    }
    if (!id) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateCredential(id, editForm);
      setCredential(updated);
      setEditForm(credentialToForm(updated));
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
    if (credential) {
      setEditForm(credentialToForm(credential));
    }
    setErrors({});
    setSaveError(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!id) return;
    const doDelete = async () => {
      try {
        await deleteCredential(id);
        setTimeout(() => router.back(), 50);
      } catch {
        if (Platform.OS === "web") {
          window.alert("削除に失敗しました。もう一度お試しください。");
        } else {
          import("react-native").then(({ Alert }) =>
            Alert.alert("エラー", "削除に失敗しました。もう一度お試しください。"),
          );
        }
      }
    };
    confirmDialog(
      "確認",
      "この情報を削除しますか？\nこの操作は取り消せません。",
      doDelete,
    );
  };

  const handleCopyAccountId = async () => {
    if (!credential?.account_id) return;
    await Clipboard.setStringAsync(credential.account_id);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (loadError || !credential) {
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
          <Button title="戻る" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header
        title={isEditing ? "編集中" : credential.service_name}
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
            <EditMode
              form={editForm}
              errors={errors}
              saveError={saveError}
              isSaving={isSaving}
              onUpdateField={updateField}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ViewMode
              credential={credential}
              isOwner={credential.user_id === user?.id}
              onCopyAccountId={handleCopyAccountId}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ViewMode({
  credential,
  isOwner,
  onCopyAccountId,
  onEdit,
  onDelete,
}: {
  credential: Credential;
  isOwner: boolean;
  onCopyAccountId: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [accountIdCopied, setAccountIdCopied] = useState(false);

  useEffect(() => {
    if (!accountIdCopied) return;
    const timer = setTimeout(() => setAccountIdCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [accountIdCopied]);

  const handleCopy = () => {
    onCopyAccountId();
    setAccountIdCopied(true);
  };

  return (
    <>
      <View className="gap-1">
        <Text className="text-body font-semibold text-text">サービス名</Text>
        <Text className="text-body text-text">{credential.service_name}</Text>
      </View>

      <View className="gap-1">
        <Text className="text-body font-semibold text-text">アカウントID</Text>
        <View className="flex-row items-center gap-2">
          <Text
            className="flex-1 text-body"
            style={{
              color: credential.account_id ? Colors.text : Colors.subtext,
            }}
          >
            {credential.account_id ?? "未登録"}
          </Text>
          {credential.account_id ? (
            <Pressable
              onPress={handleCopy}
              className="h-12 w-12 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="アカウントIDをコピー"
            >
              <Ionicons
                name={accountIdCopied ? "checkmark" : "copy-outline"}
                size={24}
                color={accountIdCopied ? Colors.success : Colors.subtext}
              />
            </Pressable>
          ) : null}
        </View>
        {accountIdCopied ? (
          <Text className="text-sm" style={{ color: Colors.success }}>
            コピーしました
          </Text>
        ) : null}
      </View>

      <PasswordField label="パスワード" value={credential.password} />
      <PasswordField label="PINコード" value={credential.pin} />

      <View className="gap-1">
        <Text className="text-body font-semibold text-text">メモ</Text>
        <Text
          className="text-body"
          style={{ color: credential.memo ? Colors.text : Colors.subtext }}
        >
          {credential.memo ?? "なし"}
        </Text>
      </View>

      {isOwner ? (
        <View className="mt-4 gap-3">
          <Button title="編集する" variant="secondary" onPress={onEdit} />
          <Button title="削除する" variant="danger" onPress={onDelete} />
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
  );
}

function EditMode({
  form,
  errors,
  saveError,
  isSaving,
  onUpdateField,
  onSave,
  onCancel,
}: {
  form: CredentialFormData;
  errors: { service_name?: string };
  saveError: string | null;
  isSaving: boolean;
  onUpdateField: (field: keyof CredentialFormData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <View>
        <TextInput
          label="サービス名（必須）"
          placeholder="例：Gmail、Amazon、楽天"
          value={form.service_name}
          onChangeText={(v) => onUpdateField("service_name", v)}
          autoCapitalize="none"
        />
        {errors.service_name ? (
          <Text className="mt-1 text-body" style={{ color: Colors.danger }}>
            {errors.service_name}
          </Text>
        ) : null}
      </View>

      <TextInput
        label="アカウントID"
        placeholder="メールアドレスまたはユーザー名"
        value={form.account_id}
        onChangeText={(v) => onUpdateField("account_id", v)}
        autoCapitalize="none"
        autoComplete="username"
      />

      <TextInput
        label="パスワード"
        placeholder="パスワードを入力"
        value={form.password}
        onChangeText={(v) => onUpdateField("password", v)}
        autoCapitalize="none"
      />

      <TextInput
        label="PINコード"
        placeholder="数字のPINコードを入力"
        value={form.pin}
        onChangeText={(v) => onUpdateField("pin", v)}
        keyboardType="number-pad"
      />

      <TextInput
        label="メモ"
        placeholder="自由にメモを入力"
        value={form.memo}
        onChangeText={(v) => onUpdateField("memo", v)}
        multiline
        numberOfLines={3}
        style={{ height: 100, textAlignVertical: "top" }}
      />

      {saveError ? <ErrorBanner message={saveError} /> : null}

      <View className="mt-4 gap-3">
        <Button
          title={isSaving ? "保存中..." : "保存する"}
          variant="primary"
          onPress={onSave}
          disabled={isSaving}
        />
        <Button
          title="キャンセル"
          variant="secondary"
          onPress={onCancel}
          disabled={isSaving}
        />
      </View>
    </>
  );
}
