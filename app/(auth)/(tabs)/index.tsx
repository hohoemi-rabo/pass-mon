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
import { SegmentControl } from "@/components/SegmentControl";
import { SearchBar } from "@/components/SearchBar";
import { CredentialCard } from "@/components/CredentialCard";
import { AnshinMemoCard } from "@/components/AnshinMemoCard";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useCredentials } from "@/hooks/useCredentials";
import { useAnshinMemos } from "@/hooks/useAnshinMemos";
import { Colors } from "@/constants/theme";
import type { CredentialSummary } from "@/types/credential";
import type { AnshinMemoSummary } from "@/types/anshinMemo";

const SEGMENTS = ["パスワード", "あんしんメモ"];
const CARD_HEIGHT = 80;
const CARD_GAP = 12;

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { listCredentials, listSharedCredentials, updateCredentialOrder } =
    useCredentials();
  const {
    listAnshinMemos,
    listSharedAnshinMemos,
    updateAnshinMemoOrder,
  } = useAnshinMemos();

  const [activeSegment, setActiveSegment] = useState(0);

  // Credentials state
  const [credentials, setCredentials] = useState<CredentialSummary[]>([]);
  const [sharedCredentials, setSharedCredentials] = useState<
    CredentialSummary[]
  >([]);

  // Memos state
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
      const [ownCreds, sharedCreds, ownMemos, sharedMs] = await Promise.all([
        listCredentials(),
        listSharedCredentials(),
        listAnshinMemos(),
        listSharedAnshinMemos(),
      ]);
      setCredentials(ownCreds);
      setSharedCredentials(sharedCreds);
      setMemos(ownMemos);
      setSharedMemos(sharedMs);
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

  const handleSegmentChange = (index: number) => {
    setActiveSegment(index);
    setSearchQuery("");
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
      style={{ paddingTop: insets.top }}
    >
      <Header title="パスもん" />

      <View className="px-4 pb-2 pt-2">
        <SegmentControl
          segments={SEGMENTS}
          activeIndex={activeSegment}
          onChange={handleSegmentChange}
        />
      </View>

      <View className="px-4 pb-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={
            activeSegment === 0 ? "サービス名で検索" : "タイトルで検索"
          }
        />
      </View>

      {activeSegment === 0 ? (
        <CredentialList
          credentials={credentials}
          sharedCredentials={sharedCredentials}
          searchQuery={searchQuery}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchList(true)}
          onDragEnd={async (data) => {
            const reordered = data.map((item, index) => ({
              ...item,
              display_order: index,
            }));
            setCredentials(reordered);
            try {
              await updateCredentialOrder(
                reordered.map((item) => ({
                  id: item.id,
                  display_order: item.display_order,
                })),
              );
            } catch (e) {
              setLoadError(
                e instanceof Error
                  ? e.message
                  : "並び替えの保存に失敗しました",
              );
              fetchList();
            }
          }}
          router={router}
        />
      ) : (
        <MemoList
          memos={memos}
          sharedMemos={sharedMemos}
          searchQuery={searchQuery}
          isRefreshing={isRefreshing}
          onRefresh={() => fetchList(true)}
          onDragEnd={async (data) => {
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
                e instanceof Error
                  ? e.message
                  : "並び替えの保存に失敗しました",
              );
              fetchList();
            }
          }}
          router={router}
        />
      )}

      {loadError ? (
        <View className="absolute bottom-24 left-4 right-4">
          <ErrorBanner message={loadError} />
        </View>
      ) : null}

      {/* FAB */}
      <Pressable
        onPress={() =>
          router.push(activeSegment === 0 ? "/add" : "/memo/add")
        }
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
        accessibilityLabel={
          activeSegment === 0 ? "パスワードを追加" : "あんしんメモを追加"
        }
      >
        <Ionicons name="add" size={32} color="#1A1A2E" />
      </Pressable>
    </View>
  );
}

// --- Credential List ---

function CredentialList({
  credentials,
  sharedCredentials,
  searchQuery,
  isRefreshing,
  onRefresh,
  onDragEnd,
  router,
}: {
  credentials: CredentialSummary[];
  sharedCredentials: CredentialSummary[];
  searchQuery: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDragEnd: (data: CredentialSummary[]) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const isSearching = searchQuery.trim().length > 0;

  const filtered = isSearching
    ? credentials.filter((c) =>
        c.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : credentials;

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<CredentialSummary>) => (
    <CredentialCard
      serviceName={item.service_name}
      accountId={item.account_id}
      onPress={() => router.push(`/${item.id}`)}
      drag={isSearching ? undefined : drag}
      isActive={isActive}
    />
  );

  if (isSearching) {
    return (
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
            icon="search"
            title="見つかりません"
            message={`「${searchQuery}」に一致するサービスがありません`}
          />
        }
      />
    );
  }

  return (
    <DraggableFlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 100,
        flexGrow: filtered.length === 0 ? 1 : undefined,
      }}
      ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
      renderItem={renderItem}
      ListEmptyComponent={
        <EmptyState
          icon="key-outline"
          title="アカウント未登録"
          message={"右下の＋ボタンから\nアカウント情報を登録しましょう"}
        />
      }
      ListFooterComponent={
        sharedCredentials.length > 0 ? (
          <SharedCredentialSection
            items={sharedCredentials}
            onPress={(id) => router.push(`/${id}`)}
          />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    />
  );
}

// --- Memo List ---

function MemoList({
  memos,
  sharedMemos,
  searchQuery,
  isRefreshing,
  onRefresh,
  onDragEnd,
  router,
}: {
  memos: AnshinMemoSummary[];
  sharedMemos: AnshinMemoSummary[];
  searchQuery: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDragEnd: (data: AnshinMemoSummary[]) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const isSearching = searchQuery.trim().length > 0;

  const filtered = isSearching
    ? memos.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : memos;

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

  if (isSearching) {
    return (
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
          <EmptyState
            icon="search"
            title="見つかりません"
            message={`「${searchQuery}」に一致するメモがありません`}
          />
        }
      />
    );
  }

  return (
    <DraggableFlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      onDragEnd={({ data }) => onDragEnd(data)}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 100,
        flexGrow: filtered.length === 0 ? 1 : undefined,
      }}
      ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
      renderItem={renderItem}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="あんしんメモはまだありません"
          message={"右下の＋ボタンから\nあんしんメモを追加しましょう"}
        />
      }
      ListFooterComponent={
        sharedMemos.length > 0 ? (
          <SharedMemoSection
            items={sharedMemos}
            onPress={(id) => router.push(`/memo/${id}`)}
          />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    />
  );
}

// --- Shared components ---

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: string;
  title: string;
  message: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons
        name={icon as any}
        size={64}
        color={Colors.border}
      />
      <Text className="mt-4 text-center text-title font-semibold text-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-body text-subtext">
        {message}
      </Text>
    </View>
  );
}

function SharedCredentialSection({
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
        <Text className="text-subtitle font-semibold text-text">
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

function SharedMemoSection({
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
