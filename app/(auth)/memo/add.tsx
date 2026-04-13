import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAnshinMemos } from "@/hooks/useAnshinMemos";
import { Colors } from "@/constants/theme";
import type { AnshinMemoFormData } from "@/types/anshinMemo";

const INITIAL_FORM: AnshinMemoFormData = {
  title: "",
  body: "",
};

export default function AddAnshinMemo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createAnshinMemo } = useAnshinMemos();
  const [form, setForm] = useState<AnshinMemoFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateField = (field: keyof AnshinMemoFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && errors.title) {
      setErrors({});
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setErrors({ title: "タイトルを入力してください" });
      return;
    }
    if (!form.body.trim()) {
      setErrors({ title: "メモの内容を入力してください" });
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      await createAnshinMemo(form);
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "保存に失敗しました。もう一度お試しください。",
      );
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
    setTimeout(() => router.back(), 50);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header title="あんしんメモを追加" onBack={() => router.back()} />
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
                label="タイトル"
                placeholder="例：通帳の場所"
                value={form.title}
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
              value={form.body}
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
                onPress={() => router.back()}
                disabled={isSaving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
