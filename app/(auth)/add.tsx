import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { useCredentials } from "@/hooks/useCredentials";
import { Colors } from "@/constants/theme";
import type { CredentialFormData } from "@/types/credential";

const INITIAL_FORM: CredentialFormData = {
  service_name: "",
  account_id: "",
  password: "",
  pin: "",
  memo: "",
};

export default function AddCredential() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createCredential } = useCredentials();
  const [form, setForm] = useState<CredentialFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ service_name?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateField = (field: keyof CredentialFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "service_name" && errors.service_name) {
      setErrors({});
    }
  };

  const handleSave = async () => {
    if (!form.service_name.trim()) {
      setErrors({ service_name: "サービス名を入力してください" });
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      await createCredential(form);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
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

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header title="新規登録" />
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
        <View className="mt-4 gap-4">
          <View>
            <TextInput
              label="サービス名（必須）"
              placeholder="例：Gmail、Amazon、楽天"
              value={form.service_name}
              onChangeText={(v) => updateField("service_name", v)}
              autoCapitalize="none"
            />
            {errors.service_name ? (
              <Text
                className="mt-1 text-body"
                style={{ color: Colors.danger }}
              >
                {errors.service_name}
              </Text>
            ) : null}
          </View>

          <TextInput
            label="アカウントID"
            placeholder="メールアドレスまたはユーザー名"
            value={form.account_id}
            onChangeText={(v) => updateField("account_id", v)}
            autoCapitalize="none"
            autoComplete="username"
          />

          <TextInput
            label="パスワード"
            placeholder="パスワードを入力"
            value={form.password}
            onChangeText={(v) => updateField("password", v)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />

          <TextInput
            label="PINコード"
            placeholder="数字のPINコードを入力"
            value={form.pin}
            onChangeText={(v) => updateField("pin", v)}
            keyboardType="number-pad"
          />

          <TextInput
            label="メモ"
            placeholder="自由にメモを入力"
            value={form.memo}
            onChangeText={(v) => updateField("memo", v)}
            multiline
            numberOfLines={3}
            style={{ height: 100, textAlignVertical: "top" }}
          />

          {saveError ? (
            <View
              className="rounded-button p-4"
              style={{
                backgroundColor: "rgba(255,107,107,0.12)",
                borderWidth: 1,
                borderColor: "rgba(255,107,107,0.25)",
              }}
            >
              <Text className="text-center text-body text-danger">
                {saveError}
              </Text>
            </View>
          ) : null}

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
              onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
              disabled={isSaving}
            />
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
