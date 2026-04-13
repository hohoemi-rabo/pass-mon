# パスもん — あんしんメモ機能 追加仕様書

> **バージョン:** 1.1
> **日付:** 2026年4月13日
> **対象:** パスもん Phase 7（あんしんメモ機能追加）
> **開発手法:** Claude Code バイブコーディング

---

## 1. 機能概要

| 項目           | 内容                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| 機能名         | あんしんメモ                                                                 |
| コンセプト     | 「もしもの時」に家族に伝えたい大切なことを残せるメモ機能                     |
| 配置           | タブナビゲーションに「あんしんメモ」タブを追加（4タブ構成）                  |
| 想定する使い方 | 大事な書類の保管場所、家族へのメッセージ、鍵の場所、お墓の情報など自由に記録 |
| 家族共有       | 既存の family_shares をそのまま適用（共有先家族は閲覧のみ）                  |
| 暗号化         | 不要（平文保存）— 秘密情報ではなく「伝えたいこと」のため                     |

---

## 2. ナビゲーション構成（変更後）

```
app/_layout.tsx
├── sign-in.tsx
└── (auth)/_layout.tsx → 認証ガード + Stack
    ├── (tabs)/_layout.tsx → Tabs（4タブに拡張）
    │   ├── index.tsx        → ホーム一覧（既存・変更なし）
    │   ├── memos.tsx        → あんしんメモ一覧（★新規）
    │   ├── share.tsx        → 家族共有設定（既存・変更なし）
    │   └── settings.tsx     → 設定（既存・変更なし）
    ├── add.tsx              → パスワード新規登録（既存・変更なし）
    ├── [id].tsx             → パスワード詳細・編集（既存・変更なし）
    ├── memo/
    │   ├── add.tsx          → あんしんメモ新規登録（★新規）
    │   └── [id].tsx         → あんしんメモ詳細・編集（★新規）
    └── ...
```

### タブ構成（4タブ）

| 順番 | タブ名       | アイコン       | 画面         |
| ---- | ------------ | -------------- | ------------ |
| 1    | ホーム       | home           | index.tsx    |
| 2    | あんしんメモ | heart          | memos.tsx    |
| 3    | 共有         | people         | share.tsx    |
| 4    | 設定         | settings-sharp | settings.tsx |

- タブアイコン・ラベルのスタイルは既存タブと統一（`Colors.tabBar` 背景、アクティブ時ゴールド）

---

## 3. データベース設計

### テーブル: anshin_memos（新規追加）

| カラム        | 型          | NULL | デフォルト | 説明                               |
| ------------- | ----------- | ---- | ---------- | ---------------------------------- |
| id            | uuid        | NO   | auto       | 主キー                             |
| user_id       | uuid        | NO   | —          | FK → profiles.id                   |
| title         | text        | NO   | —          | メモのタイトル                     |
| body          | text        | NO   | —          | メモの本文（複数行）               |
| display_order | integer     | NO   | 0          | 表示順（ドラッグ並び替え用、昇順） |
| created_at    | timestamptz | NO   | now()      | 作成日時                           |
| updated_at    | timestamptz | NO   | now()      | 更新日時                           |

**インデックス:** `idx_anshin_memos_user_display_order` ON (user_id, display_order)

### マイグレーションSQL

```sql
-- テーブル作成
CREATE TABLE anshin_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX idx_anshin_memos_user_display_order ON anshin_memos(user_id, display_order);

-- updated_at 自動更新トリガー（既存の update_updated_at 関数を再利用）
CREATE TRIGGER set_anshin_memos_updated_at
  BEFORE UPDATE ON anshin_memos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### RLS

```sql
-- RLSの有効化
ALTER TABLE anshin_memos ENABLE ROW LEVEL SECURITY;

-- SELECT: 本人 または 共有先家族（credentials と同じロジック）
CREATE POLICY "anshin_memos_select" ON anshin_memos FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM family_shares
    WHERE owner_id = anshin_memos.user_id
    AND shared_with_id = auth.uid()
    AND status = 'active'
  )
);

-- INSERT: 本人のみ
CREATE POLICY "anshin_memos_insert" ON anshin_memos FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE: 本人のみ
CREATE POLICY "anshin_memos_update" ON anshin_memos FOR UPDATE
USING (user_id = auth.uid());

-- DELETE: 本人のみ
CREATE POLICY "anshin_memos_delete" ON anshin_memos FOR DELETE
USING (user_id = auth.uid());
```

---

## 4. 型定義

### AnshinMemo（完全データ）

```typescript
{
  id: string;
  user_id: string;
  title: string;
  body: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
```

### AnshinMemoSummary（リスト表示用）

```typescript
{
  id: string;
  title: string;
  body: string; // プレビュー用に全文取得、表示時に2行に切り詰め
  display_order: number;
  created_at: string;
}
```

### AnshinMemoFormData（作成/更新フォーム入力）

```typescript
{
  title: string;
  body: string;
}
```

---

## 5. 画面仕様

### 5.1 あんしんメモ一覧画面（memos.tsx）

**タブ:** あんしんメモ（heart アイコン）

**状態管理:**

- `memos` — 自分のあんしんメモ一覧
- `sharedMemos` — 家族の共有メモ
- `isLoading` / `isRefreshing` — ローディング状態
- `loadError` — エラーメッセージ
- `searchQuery` — 検索文字列

**UI構成:**

1. ヘッダー「あんしんメモ」
2. 検索バー（タイトルで絞り込み、大文字小文字区別なし）
   - SearchBar コンポーネント使用（placeholder: "タイトルで検索"）
3. メモリスト
   - **通常時:** `DraggableFlatList` — 長押しでドラッグ並び替え
   - **検索時:** 通常 `FlatList`（ドラッグ無効）
   - カード間隔: 12px
   - プルリフレッシュ対応（ゴールドスピナー）
4. 家族の共有メモセクション（リスト下部、共有メモがある場合のみ）
5. FAB（フローティングアクションボタン）
   - 右下固定、64x64px、ゴールド円形
   - 「+」アイコン、タップで `/memo/add` へ遷移
6. 空状態表示
   - heart-outline アイコン（64px、サブテキスト色）
   - 「あんしんメモはまだありません」
   - 「＋ボタンから追加してください」

**データ取得:**

- `useFocusEffect` で画面フォーカス時に再取得
- `listAnshinMemos()` → 自分のメモ（display_order ASC）
- `listSharedAnshinMemos()` → 家族の共有メモ

**並び替え:**

- ドラッグ完了時: `updateAnshinMemoOrder()` で一括更新
- 失敗時: ErrorBanner + 元の順序に復帰

### 5.2 あんしんメモカード（AnshinMemoCard コンポーネント）

| プロパティ | 型         | 必須 | 説明                       |
| ---------- | ---------- | ---- | -------------------------- |
| title      | string     | YES  | メモのタイトル             |
| body       | string     | YES  | メモの本文（プレビュー用） |
| onPress    | () => void | YES  | タップ時コールバック       |
| drag       | () => void | NO   | ドラッグ開始コールバック   |
| isActive   | boolean    | NO   | ドラッグ中フラグ           |

**レイアウト:**

- 既存 CredentialCard と同じ基本構造（Card コンポーネントベース）
- ドラッグハンドル: `reorder-three` アイコン（24px、左側、`drag` 指定時のみ表示）
- カード左側に heart アイコン（20px、`Colors.secondary`）で視覚的にパスワードカードと差別化
- タイトル: 18px bold、`Colors.text`
- 本文プレビュー: 16px、`Colors.subtext`、最大2行（`numberOfLines={2}`）
- ドラッグ中: 背景 `Colors.cardElevated`、影増大、opacity 0.9

### 5.3 あんしんメモ新規登録画面（memo/add.tsx）

**アクセス:** Stack push（タブ非表示）

**UI構成:**

1. ヘッダー「あんしんメモを追加」+ 戻るボタン（Header コンポーネント）
2. フォーム:
   - タイトル（TextInput コンポーネント、label: "タイトル"、placeholder: "例：通帳の場所"）
   - 本文（TextInput コンポーネント、label: "メモ"、placeholder: "家族に伝えたいことを書いてください"、multiline: true、numberOfLines: 6、textAlignVertical: "top"）
3. ErrorBanner（エラー時）
4. 「保存する」ボタン（primary バリアント）
   - タイトルまたは本文が空の場合: disabled

**保存処理:**

1. バリデーション（タイトル・本文が空でないこと）
2. `createAnshinMemo(formData)` 呼び出し
3. 成功: `setTimeout(() => router.back(), 50)`
4. 失敗: ErrorBanner でエラー表示

### 5.4 あんしんメモ詳細・編集画面（memo/[id].tsx）

**アクセス:** Stack push（タブ非表示）

**状態管理:**

- `memo` — 取得したメモデータ
- `isEditing` — 編集モードフラグ
- `isLoading` / `isSaving` / `isDeleting`
- `loadError` / `saveError`

#### 閲覧モード

**UI構成:**

1. ヘッダー: タイトル + 戻るボタン（Header コンポーネント）
2. 表示フィールド:
   - タイトル（22px bold、`Colors.text`）
   - 本文（18px、`Colors.text`、改行対応）
   - 作成日時（16px、`Colors.subtext`）
3. 本人のみ表示されるボタン:
   - 「編集する」（secondary バリアント）
   - 「削除する」（danger バリアント）→ 確認ダイアログ → 削除 → `setTimeout(() => router.back(), 50)`
4. 他人のデータ: 「閲覧のみ（家族共有）」バッジ（ティール背景） — 既存と同じパターン

#### 編集モード

**UI構成:**

1. ヘッダー: 「編集中」（戻るボタンなし）
2. フォームフィールド（新規登録と同じ構成、既存値でプリフィル）
3. ボタン:
   - 「保存する」（primary バリアント）
   - 「キャンセル」（secondary バリアント）→ フォームリセット → 閲覧モードへ

**保存処理:**

1. バリデーション → `updateAnshinMemo(id, formData)` 呼び出し
2. 成功: 閲覧モードに切替（ナビゲーションなし）
3. 失敗: ErrorBanner でエラー表示

---

## 6. カスタムフック

### useAnshinMemos()（新規）

| 関数                  | 引数                         | 戻り値                       | 説明                                |
| --------------------- | ---------------------------- | ---------------------------- | ----------------------------------- |
| listAnshinMemos       | —                            | Promise<AnshinMemoSummary[]> | 自分のメモ一覧（display_order ASC） |
| listSharedAnshinMemos | —                            | Promise<AnshinMemoSummary[]> | 家族の共有メモ一覧                  |
| getAnshinMemo         | id: string                   | Promise<AnshinMemo>          | メモ詳細取得                        |
| createAnshinMemo      | form: AnshinMemoFormData     | Promise<AnshinMemo>          | 新規作成（display_order: 0）        |
| updateAnshinMemo      | id, form: AnshinMemoFormData | Promise<AnshinMemo>          | 更新                                |
| updateAnshinMemoOrder | items: {id, display_order}[] | Promise<void>                | 並び順一括更新                      |
| deleteAnshinMemo      | id: string                   | Promise<void>                | 削除                                |

- credentials フックと同じパターン: 全関数はエラー時に throw（内部 state なし）
- 画面側で try-catch してエラーを管理
- 暗号化処理なし（平文のため、直接 Supabase クエリ）

---

## 7. コンポーネント追加・変更一覧

### 新規追加

| ファイル                        | 種類           | 説明                                                |
| ------------------------------- | -------------- | --------------------------------------------------- |
| `app/(auth)/(tabs)/memos.tsx`   | 画面           | あんしんメモ一覧                                    |
| `app/(auth)/memo/add.tsx`       | 画面           | あんしんメモ新規登録                                |
| `app/(auth)/memo/[id].tsx`      | 画面           | あんしんメモ詳細・編集                              |
| `components/AnshinMemoCard.tsx` | コンポーネント | メモカード                                          |
| `hooks/useAnshinMemos.ts`       | フック         | メモCRUD操作                                        |
| `types/anshinMemo.ts`           | 型定義         | AnshinMemo / AnshinMemoSummary / AnshinMemoFormData |

### 変更

| ファイル                        | 変更内容                                      |
| ------------------------------- | --------------------------------------------- |
| `app/(auth)/(tabs)/_layout.tsx` | タブに「あんしんメモ」を追加（3タブ → 4タブ） |

### 変更なし

| ファイル                         | 理由                                                                     |
| -------------------------------- | ------------------------------------------------------------------------ |
| `app/(auth)/(tabs)/index.tsx`    | パスワード一覧は変更不要                                                 |
| `app/(auth)/(tabs)/share.tsx`    | 家族共有は既存 RLS で自動対応                                            |
| `app/(auth)/(tabs)/settings.tsx` | 変更不要                                                                 |
| `app/(auth)/add.tsx`             | パスワード登録は変更不要                                                 |
| `app/(auth)/[id].tsx`            | パスワード詳細は変更不要                                                 |
| 既存コンポーネント全般           | Button, Card, Header, TextInput, SearchBar, ErrorBanner はそのまま再利用 |

---

## 8. エラーメッセージ（追加分）

| 状況             | メッセージ                                       |
| ---------------- | ------------------------------------------------ |
| メモ保存失敗     | 「保存に失敗しました。もう一度お試しください。」 |
| メモ取得失敗     | 「データの取得に失敗しました」                   |
| メモ削除失敗     | 「削除に失敗しました。もう一度お試しください。」 |
| 並び替え保存失敗 | 「並び替えの保存に失敗しました」                 |

---

## 9. 家族共有との連携

- 既存の `family_shares` テーブルと RLS ポリシーをそのまま利用
- 追加の共有設定画面は不要 — パスワードの共有設定がそのままメモにも適用される
- 家族がログインした際、あんしんメモタブにも共有元のメモが自動表示される
- 家族側は閲覧のみ（編集・削除ボタン非表示、「閲覧のみ（家族共有）」バッジ表示）
- 共有解除すると、パスワード・あんしんメモ両方の閲覧権限が同時に失われる

---

## 10. 開発スケジュール（目安）

| 作業                                                   | 期間 |
| ------------------------------------------------------ | ---- |
| DB テーブル・RLS・インデックス作成                     | 半日 |
| 型定義・useAnshinMemos フック                          | 半日 |
| タブ追加・AnshinMemoCard コンポーネント                | 半日 |
| あんしんメモ一覧画面（DraggableFlatList + 検索 + FAB） | 1日  |
| 新規登録画面                                           | 半日 |
| 詳細・編集画面                                         | 1日  |
| 家族共有閲覧対応・テスト                               | 半日 |

**合計約4日**（Claude Code バイブコーディング想定）
