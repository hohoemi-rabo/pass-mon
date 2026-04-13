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
import DraggableFlatList, {
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { AnshinMemoCard } from "@/components/AnshinMemoCard";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAnshinMemos } from "@/hooks/useAnshinMemos";
import { Colors } from "@/constants/theme";
import type { AnshinMemoSummary } from "@/types/anshinMemo";

const CARD_GAP = 12;

export default function MemosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { listAnshinMemos, listSharedAnshinMemos, updateAnshinMemoOrder } =
    useAnshinMemos();

  const [memos, setMemos] = useState<AnshinMemoSummary[]>([]);
  const [sharedMemos, setSharedMemos] = useState<AnshinMemoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchList = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    setLoadError(null);
    try {
      const [own, shared] = await Promise.all([
        listAnshinMemos(),
        listSharedAnshinMemos(),
      ]);
      setMemos(own);
      setSharedMemos(shared);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : "データの取得に失敗しました",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const isSearching = searchQuery.trim().length > 0;

  const filtered = isSearching
    ? memos.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : memos;

  const handleDragEnd = async ({ data }: { data: AnshinMemoSummary[] }) => {
    const reordered = data.map((item, index) => ({
      ...item,
      display_order: index,
    }));
    setMemos(reordered);

    try {
      await updateAnshinMemoOrder(
        reordered.map((item) => ({
          id: item.id,
          display_order: item.display_order,
        })),
      );
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : "並び替えの保存に失敗しました",
      );
      fetchList();
    }
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<AnshinMemoSummary>) => (
    <AnshinMemoCard
      title={item.title}

      onPress={() => router.push(`/memo/${item.id}`)}
      drag={isSearching ? undefined : drag}
      isActive={isActive}
    />
  );

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
      <Header title="あんしんメモ" />

      <View className="px-4 pb-3 pt-2">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="タイトルで検索"
        />
      </View>

      {isSearching ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: filtered.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
          renderItem={({ item }) => (
            <AnshinMemoCard
              title={item.title}
        
              onPress={() => router.push(`/memo/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState hasData={true} searchQuery={searchQuery} />
          }
        />
      ) : (
        <DraggableFlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: filtered.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              hasData={memos.length > 0}
              searchQuery={searchQuery}
            />
          }
          ListFooterComponent={
            sharedMemos.length > 0 ? (
              <SharedSection
                items={sharedMemos}
                onPress={(id) => router.push(`/memo/${id}`)}
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
      )}

      {loadError ? (
        <View className="absolute bottom-24 left-4 right-4">
          <ErrorBanner message={loadError} />
        </View>
      ) : null}

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/memo/add")}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          height: 64,
          width: 64,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
          backgroundColor: Colors.primary,
          elevation: 6,
          boxShadow: "0px 4px 12px rgba(212,160,86,0.4)",
        }}
        accessibilityRole="button"
        accessibilityLabel="あんしんメモを追加"
      >
        <Ionicons name="add" size={32} color="#1A1A2E" />
      </Pressable>
    </View>
  );
}

function EmptyState({
  hasData,
  searchQuery,
}: {
  hasData: boolean;
  searchQuery: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons
        name={hasData ? "search" : "heart-outline"}
        size={64}
        color={Colors.border}
      />
      <Text className="mt-4 text-center text-title font-semibold text-text">
        {hasData ? "見つかりません" : "あんしんメモはまだありません"}
      </Text>
      <Text className="mt-2 text-center text-body text-subtext">
        {hasData
          ? `「${searchQuery}」に一致するメモがありません`
          : "右下の＋ボタンから\nあんしんメモを追加しましょう"}
      </Text>
    </View>
  );
}

function SharedSection({
  items,
  onPress,
}: {
  items: AnshinMemoSummary[];
  onPress: (id: string) => void;
}) {
  return (
    <View className="mt-6 gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name="people" size={22} color={Colors.secondary} />
        <Text className="text-subtitle font-semibold text-text">
          家族の共有メモ
        </Text>
      </View>
      {items.map((item) => (
        <AnshinMemoCard
          key={item.id}
          title={item.title}
    
          onPress={() => onPress(item.id)}
        />
      ))}
    </View>
  );
}
