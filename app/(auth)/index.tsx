import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CredentialCard } from "@/components/CredentialCard";
import { useCredentials } from "@/hooks/useCredentials";
import { Colors } from "@/constants/theme";
import type { CredentialSummary } from "@/types/credential";

const CARD_HEIGHT = 80;
const CARD_GAP = 12;

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { listCredentials, listSharedCredentials } = useCredentials();

  const [credentials, setCredentials] = useState<CredentialSummary[]>([]);
  const [sharedCredentials, setSharedCredentials] = useState<
    CredentialSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchList = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    setLoadError(null);
    try {
      const [own, shared] = await Promise.all([
        listCredentials(),
        listSharedCredentials(),
      ]);
      setCredentials(own);
      setSharedCredentials(shared);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : "データの取得に失敗しました",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch on mount and re-fetch when navigating back from add/edit/delete
  useFocusEffect(
    useCallback(() => {
      fetchList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const filtered = searchQuery.trim()
    ? credentials.filter((c) =>
        c.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : credentials;

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
      style={{ paddingTop: insets.top }}
    >
      <Header title="パスもん" />

      <View className="px-4 pb-3 pt-2">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT + CARD_GAP,
          offset: (CARD_HEIGHT + CARD_GAP) * index,
          index,
        })}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          flexGrow: filtered.length === 0 ? 1 : undefined,
        }}
        ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
        renderItem={({ item }) => (
          <CredentialCard
            serviceName={item.service_name}
            accountId={item.account_id}
            onPress={() => router.push(`/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            hasCredentials={credentials.length > 0}
            searchQuery={searchQuery}
          />
        }
        ListFooterComponent={
          sharedCredentials.length > 0 && !searchQuery.trim() ? (
            <SharedSection
              items={sharedCredentials}
              onPress={(id) => router.push(`/${id}`)}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchList(true)}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />

      {loadError ? (
        <View className="absolute bottom-24 left-4 right-4 rounded-button bg-danger/10 p-3">
          <Text className="text-center text-body text-danger">{loadError}</Text>
        </View>
      ) : null}

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/add")}
        className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full"
        style={({ pressed }) => ({
          backgroundColor: pressed ? Colors.primaryDark : Colors.primary,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        })}
        accessibilityRole="button"
        accessibilityLabel="新規登録"
      >
        <Ionicons name="add" size={32} color={Colors.text} />
      </Pressable>
    </View>
  );
}

function EmptyState({
  hasCredentials,
  searchQuery,
}: {
  hasCredentials: boolean;
  searchQuery: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons
        name={hasCredentials ? "search" : "key-outline"}
        size={64}
        color={Colors.inputBorder}
      />
      <Text className="mt-4 text-center text-title font-bold text-text">
        {hasCredentials ? "見つかりません" : "アカウント未登録"}
      </Text>
      <Text className="mt-2 text-center text-body text-subtext">
        {hasCredentials
          ? `「${searchQuery}」に一致するサービスがありません`
          : "右下の＋ボタンから\nアカウント情報を登録しましょう"}
      </Text>
    </View>
  );
}

function SharedSection({
  items,
  onPress,
}: {
  items: CredentialSummary[];
  onPress: (id: string) => void;
}) {
  return (
    <View className="mt-6 gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name="people" size={22} color={Colors.secondary} />
        <Text className="text-subtitle font-bold text-text">
          家族の共有データ
        </Text>
      </View>
      {items.map((item) => (
        <CredentialCard
          key={item.id}
          serviceName={item.service_name}
          accountId={item.account_id}
          onPress={() => onPress(item.id)}
        />
      ))}
    </View>
  );
}
