# パスもん（Pass-Mon） 仕様書

## 1. プロジェクト概要

**パスもん** は、シニア向けアカウント・パスワード・PINコード管理アプリ。
ほほえみラボの生徒（シニア約20名）とその家族が対象。紙のノート管理からの脱却を目指す。

- **アプリ名:** パスもん
- **バージョン:** 1.0.0
- **対象プラットフォーム:** Android（APK直接配布）、iOS（TestFlight）、Web
- **対象ユーザー:** シニア（主）、その家族（閲覧用）

---

## 2. 技術スタック

| 分類 | 技術 | バージョン |
|------|------|-----------|
| フロントエンド | Expo (React Native) | SDK 54 / RN 0.81 |
| 言語 | TypeScript | 5.9 |
| ルーティング | Expo Router | 6（ファイルベース、型付きルート） |
| スタイリング | NativeWind (Tailwind CSS) | — |
| フォント | M PLUS Rounded 1c | 400/500/700 |
| バックエンド/DB | Supabase (PostgreSQL) | — |
| 認証 | Supabase Auth (Google OAuth) | expo-auth-session |
| 暗号化 | Supabase pgcrypto | AES-256 サーバーサイド |
| アニメーション | react-native-reanimated | v4 |
| リスト並び替え | react-native-draggable-flatlist | v4 |
| ビルド・配布 | EAS Build | APK / AAB / TestFlight |

### 実験的機能（有効化済み）

- `reactCompiler: true` — React Compiler による自動最適化（`useMemo`/`useCallback` 手動追加不要）
- `typedRoutes: true` — 型安全なルーティング
- `newArchEnabled: true` — React Native 新アーキテクチャ

---

## 3. アプリ設定

| 項目 | 値 |
|------|-----|
| バンドルID (iOS) | `com.hohoemi-labo.pass-mon` |
| パッケージ名 (Android) | `com.hohoemilabo.passmon` |
| URLスキーム | `passmon://` |
| 画面向き | 縦向き固定（portrait） |
| ステータスバー | light スタイル（ダーク背景のため白文字） |
| Android edgeToEdge | 有効 |
| Android キーボード | pan モード（コンテンツをスクロール） |

### EAS Build プロファイル

| プロファイル | 用途 | 出力形式 | 配布方法 |
|------------|------|---------|---------|
| development | 開発 | Dev Client | internal |
| preview | テスト配布 | APK | internal（直接配布） |
| production | 本番 | AAB | Play Store / TestFlight |

---

## 4. デザインシステム

### コンセプト

「上品で落ち着いた、スタイリッシュで迷わない」
ダークネイビー × ウォームゴールドの配色で、高級感と視認性を両立。

### カラーパレット

| 用途 | カラー | 定数名 |
|------|--------|--------|
| プライマリ | `#D4A056`（ウォームゴールド） | `Colors.primary` |
| プライマリDark | `#B8893E` | `Colors.primaryDark` |
| セカンダリ | `#5BBFB8`（ソフトティール） | `Colors.secondary` |
| セカンダリDark | `#4AA9A2` | `Colors.secondaryDark` |
| 背景 | `#091b36`（ダークネイビー） | `Colors.background` |
| カード背景 | `#0d2847`（ネイビーサーフェス） | `Colors.card` |
| カード高 | `#112f52`（エレベーテッドサーフェス） | `Colors.cardElevated` |
| テキスト | `#FFFFFF` | `Colors.text` |
| サブテキスト | `#8BA3C4`（ブルーグレー） | `Colors.subtext` |
| プレースホルダー | `#4A6A8C`（薄めブルーグレー） | `Colors.placeholder` |
| ボーダー | `#1A3556` | `Colors.border` |
| 入力ボーダー | `#2A4A6E` | `Colors.inputBorder` |
| 入力フォーカス | `#D4A056`（ゴールド） | `Colors.inputFocus` |
| タブバー | `#061527`（ディープネイビー） | `Colors.tabBar` |
| 危険 | `#FF6B6B` | `Colors.danger` |
| 成功 | `#51CF66` | `Colors.success` |

### オーバーレイ色（RGBA）

RGBA のハードコード禁止。`Overlays` 定数を使用:

| 定数名 | 値 | 用途 |
|--------|-----|------|
| `primaryLight` | `rgba(212,160,86,0.15)` | プライマリ背景 |
| `primaryBorder` | `rgba(212,160,86,0.3)` | プライマリボーダー |
| `dangerLight` | `rgba(255,107,107,0.12)` | エラー背景 |
| `dangerBorder` | `rgba(255,107,107,0.25)` | エラーボーダー |
| `secondaryLight` | `rgba(91,191,184,0.12)` | セカンダリ背景 |
| `secondaryBorder` | `rgba(91,191,184,0.25)` | セカンダリボーダー |
| `cardBorder` | `rgba(255,255,255,0.06)` | カードボーダー |
| `pressedLight` | `rgba(255,255,255,0.08)` | 押下時背景 |

### フォント

| ウェイト | 定数名 | 用途 |
|---------|--------|------|
| Regular (400) | `FontFamily.regular` | 本文 |
| Medium (500) | `FontFamily.medium` | ボタン、ラベル |
| Bold (700) | `FontFamily.bold` | 見出し |

- `_layout.tsx` の `Text.render` パッチにより全 `<Text>` に自動適用

### サイズ規約

| 要素 | 最小サイズ |
|------|-----------|
| フォント（本文） | 18px |
| フォント（見出し） | 22px 以上 |
| タップ領域 | 48 x 48 dp |
| コントラスト比 | WCAG AA 準拠 |

### スペーシング

| 名前 | 値 |
|------|-----|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

### 角丸

| 要素 | 値 |
|------|-----|
| ボタン | 12px |
| カード | 16px |
| 入力欄 | 12px |

---

## 5. データベース設計

### テーブル: credentials

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | auto | 主キー |
| user_id | uuid | NO | — | FK → profiles.id |
| service_name | text | NO | — | サービス名（例: Gmail） |
| account_id | text | YES | null | アカウントID / メールアドレス |
| password_encrypted | text | YES | null | AES-256 暗号化済みパスワード |
| pin_encrypted | text | YES | null | AES-256 暗号化済みPINコード |
| memo | text | YES | null | メモ |
| display_order | integer | NO | 0 | 表示順（ドラッグ並び替え用、昇順） |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**インデックス:** `idx_credentials_user_display_order` ON (user_id, display_order)

### テーブル: family_shares

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | auto | 主キー |
| owner_id | uuid | NO | — | FK → profiles.id（共有元） |
| shared_with_id | uuid | YES | null | FK → profiles.id（共有先、受諾前はnull） |
| invite_code | text | NO | — | 6文字の招待コード |
| status | text | NO | "pending" | "pending" or "active" |
| created_at | timestamptz | NO | now() | 作成日時 |

### テーブル: profiles

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | — | 主キー（= auth.users.id） |
| display_name | text | YES | null | 表示名 |
| avatar_url | text | YES | null | アバターURL（将来用） |
| created_at | timestamptz | NO | now() | 作成日時 |

### RPC関数

| 関数名 | 引数 | 戻り値 | 修飾子 | 説明 |
|--------|------|--------|--------|------|
| `encrypt_credential` | plain_text: string | string | SECURITY DEFINER | AES-256 暗号化 |
| `decrypt_credential` | cipher_text: string | string | SECURITY DEFINER | AES-256 復号 |
| `accept_family_invite` | code: string | void | SECURITY DEFINER | 招待コードで家族共有を受諾 |

- 暗号化キーは Supabase Vault で管理（クライアントに露出しない）
- SECURITY DEFINER 関数には `SET search_path = public` を付与

### セキュリティ（RLS）

- **本人:** 自分のクレデンシャルにのみ CRUD 可能
- **家族:** アクティブな共有関係がある場合、閲覧のみ可能
- **管理者:** パスワード平文にはアクセス不可

---

## 6. 型定義

### Credential（復号済み完全データ）

```typescript
{
  id: string;
  user_id: string;
  service_name: string;
  account_id: string | null;
  password: string | null;     // 復号済み
  pin: string | null;          // 復号済み
  memo: string | null;
  created_at: string;
  updated_at: string;
}
```

### CredentialSummary（リスト表示用、機密データなし）

```typescript
{
  id: string;
  service_name: string;
  account_id: string | null;
  display_order: number;
  created_at: string;
}
```

### CredentialFormData（作成/更新フォーム入力）

```typescript
{
  service_name: string;
  account_id: string;
  password: string;
  pin: string;
  memo: string;
}
```

### FamilyShareInfo（自分の共有情報）

```typescript
{
  id: string;
  inviteCode: string;
  status: "none" | "pending" | "active";
  sharedWithName: string | null;
  createdAt: string;
}
```

### SharedFromInfo（家族から受け取った共有）

```typescript
{
  ownerName: string | null;
  ownerId: string;
}
```

---

## 7. 画面仕様

### 7.1 ナビゲーション構成

```
app/_layout.tsx          → GestureHandlerRootView + SafeAreaProvider + Font + AuthContext + Slot
├── sign-in.tsx          → 未認証用ログイン画面（ルート直下）
└── (auth)/_layout.tsx   → 認証ガード + Stack
    ├── (tabs)/_layout.tsx → Tabs（ホーム / 共有 / 設定）
    │   ├── index.tsx      → ホーム一覧（DraggableFlatList + 検索 + FAB）
    │   ├── share.tsx      → 家族共有設定
    │   └── settings.tsx   → 設定（ログアウト・バージョン）
    ├── add.tsx            → 新規登録（Stack push、タブ非表示）
    └── [id].tsx           → 詳細・編集（Stack push、タブ非表示）
```

### 7.2 ログイン画面（sign-in.tsx）

**アクセス条件:** 未認証ユーザーのみ（認証済みなら `/` にリダイレクト）

**UI構成:**
1. ロゴセクション（中央配置）
   - 鍵アイコン（48px）— 112x112px の金色円内
   - アプリ名「パスもん」（28px、semibold）
   - サブタイトル「かんたん・あんしんパスワード管理」（18px）
2. エラー表示（ErrorBanner）
3. ログインボタン「Googleでログイン」（primary バリアント）
   - ローディング中: 「ログイン中...」、disabled

**認証フロー:**
- **Web:** Supabase OAuth のフルページリダイレクト
- **ネイティブ:** アプリ内ブラウザ（`WebBrowser.openAuthSessionAsync`）
- 成功時: `onAuthStateChange` が発火 → 認証ガードによりホームへリダイレクト

### 7.3 ホーム画面（index.tsx）

**タブ:** ホーム（home アイコン）

**状態管理:**
- `credentials` — 自分のクレデンシャル一覧
- `sharedCredentials` — 家族の共有データ
- `isLoading` / `isRefreshing` — ローディング状態
- `loadError` — エラーメッセージ
- `searchQuery` — 検索文字列

**UI構成:**
1. ヘッダー「パスもん」
2. 検索バー（サービス名で絞り込み、大文字小文字区別なし）
3. クレデンシャルリスト
   - **通常時:** `DraggableFlatList` — 長押しでドラッグ並び替え
   - **検索時:** 通常 `FlatList`（ドラッグ無効）
   - カード高さ: 80px、間隔: 12px
   - プルリフレッシュ対応（ゴールドスピナー）
4. 家族の共有データセクション（リスト下部、共有データがある場合のみ）
5. FAB（フローティングアクションボタン）
   - 右下固定、64x64px、ゴールド円形
   - 「+」アイコン、タップで新規登録画面へ
6. 空状態表示
   - 登録なし: 鍵アイコン + 「アカウント未登録」 + FAB の案内
   - 検索結果なし: 検索アイコン + 「見つかりません」

**ドラッグ&ドロップ並び替え:**
- 長押しでカードが浮き上がり、ドラッグ可能に
- ドロップ時に `display_order` を配列のインデックスに割り当て
- DB に一括保存（`updateCredentialOrder`）
- 保存失敗時: エラー表示 + リスト再取得
- 検索中はドラッグ無効

### 7.4 新規登録画面（add.tsx）

**アクセス:** Stack push（タブバー非表示）

**フォームフィールド:**

| フィールド | 必須 | 入力タイプ | placeholder |
|-----------|------|-----------|-------------|
| サービス名 | YES | テキスト | 例：Gmail、Amazon、楽天 |
| アカウントID | NO | テキスト（autoComplete="username"） | メールアドレスまたはユーザー名 |
| パスワード | NO | secureTextEntry（autoComplete="password"） | パスワードを入力 |
| PINコード | NO | number-pad | 数字のPINコードを入力 |
| メモ | NO | multiline（3行、100px高） | 自由にメモを入力 |

**バリデーション:**
- サービス名が空: 「サービス名を入力してください」（赤テキスト、フィールド下部）
- 入力開始で自動クリア

**ボタン:**
- 「保存する」（primary）/ 「保存中...」（ローディング時、disabled）
- 「キャンセル」（secondary）→ 即座に `router.back()`

**保存処理:**
1. バリデーション → 暗号化 → DB保存
2. `display_order: 0` で保存（リスト先頭に追加）
3. 成功: 50ms 遅延後に `router.back()`
4. 失敗: ErrorBanner でエラー表示

### 7.5 詳細・編集画面（[id].tsx）

**アクセス:** カードタップで Stack push（タブバー非表示）

#### 閲覧モード（デフォルト）

**UI構成:**
1. ヘッダー: サービス名 + 戻るボタン（chevron-back）
2. 表示フィールド（読み取り専用）:
   - サービス名
   - アカウントID（コピーボタン付き、コピー成功: 緑チェック + 「コピーしました」1.5秒間表示）
   - パスワード（PasswordField — マスク表示 ●●●●、目アイコンで表示切替、コピーボタン）
   - PINコード（PasswordField — 同上）
   - メモ
   - 値がない場合: 「未登録」をサブテキスト色で表示
3. 本人のみ表示されるボタン:
   - 「編集する」（secondary）
   - 「削除する」（danger）→ 確認ダイアログ → 削除 → 戻る
4. 他人のデータ: 「閲覧のみ（家族共有）」バッジ（ティール背景）

#### 編集モード

**UI構成:**
1. ヘッダー: 「編集中」（戻るボタンなし）
2. フォームフィールド（新規登録と同じ構成）
3. ボタン:
   - 「保存する」（primary）
   - 「キャンセル」（secondary）→ フォームリセット → 閲覧モードへ

**保存処理:**
1. バリデーション → 暗号化 → DB更新
2. 成功: 閲覧モードに切替（ナビゲーションなし）
3. 失敗: ErrorBanner でエラー表示

### 7.6 家族共有画面（share.tsx）

**タブ:** 共有（people アイコン）

#### あなたの共有設定セクション

**未招待時:**
- 説明テキスト: 「もしもの時に家族があなたのアカウント情報を閲覧できるようにします。」
- 「家族を招待する」ボタン（primary）

**招待中（status: pending）:**
- 時計アイコン（ゴールド）+ 「招待中」
- 「家族がまだ受けていません」
- 招待コード表示（大きな太字、カード内）
- 「LINEやメールで共有」ボタン（primary）→ ネイティブ Share API
- 「共有を解除する」ボタン（danger）→ 確認ダイアログ

**共有中（status: active）:**
- チェックアイコン（緑）+ 「共有中」
- 「{名前}さんと共有中」
- 招待コード表示
- 「共有を解除する」ボタン（danger）→ 確認ダイアログ

#### 家族の共有を受けるセクション

**未受信時:**
- 説明テキスト: 「招待コードを入力して、家族のアカウント情報を閲覧できるようにします。」
- 招待コード入力欄（autoCapitalize="characters"）
- 「招待を受ける」ボタン（secondary、入力空で disabled）

**受信中:**
- people アイコン（緑）+ 「共有中」
- 「{名前}さんのアカウント情報を閲覧できます」

**招待コード仕様:**
- 6文字の英数字
- 紛らわしい文字を除外（I, O, 1, l）
- 入力時は自動大文字変換

### 7.7 設定画面（settings.tsx）

**タブ:** 設定（settings-sharp アイコン）

**UI構成:**
1. アカウントカード
   - 「アカウント」ラベル
   - メールアドレス表示（取得できない場合は「不明」）
2. アプリ情報カード
   - バージョン: `Constants.expoConfig?.version`（フォールバック: "1.0.0"）
   - アプリ名: 「パスもん」
3. 区切り線
4. 「ログアウト」ボタン（danger バリアント）
   - 確認ダイアログ: 「ログアウトしますか？」
   - 確認後: セッションクリア → ログイン画面にリダイレクト

---

## 8. 共通コンポーネント

### Button

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | YES | ボタンテキスト |
| variant | "primary" \| "secondary" \| "danger" | NO | スタイルバリアント（default: primary） |
| disabled | boolean | NO | 無効状態 |

**バリアント詳細:**

| バリアント | 背景 | ボーダー | テキスト色 |
|-----------|------|---------|-----------|
| primary | ゴールド | なし | ダーク（#1A1A2E） |
| secondary | 透明 | ゴールド 1.5px | ゴールド |
| danger | 赤半透明 | 赤 1.5px | 赤 |
| disabled | グレー | — | サブテキスト、opacity 0.5 |

- 最小高さ: 52px、角丸: 12px、フォント: 20px medium

### Card

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| children | ReactNode | YES | カード内コンテンツ |
| style | ViewStyle | NO | 追加スタイル（マージされる） |

- 背景: `Colors.card`、角丸: 16px、ボーダー: `Overlays.cardBorder`
- 影: `boxShadow: "0px 2px 8px rgba(0,0,0,0.3)"`

### Header

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | YES | ヘッダータイトル |
| onBack | () => void | NO | 戻るボタンのコールバック（指定時のみ表示） |

- タイトル: 28px bold、letter-spacing: 0.5px
- 戻るボタン: 40x40px、chevron-back アイコン（28px）

### TextInput

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| label | string | YES | ラベルテキスト |
| secureTextEntry | boolean | NO | パスワード入力モード（表示切替アイコン付き） |
| その他 | RNTextInputProps | NO | React Native TextInput の全プロパティ |

- 入力欄高さ: 52px、角丸: 12px
- フォーカス時: ボーダー 2px ゴールド
- プレースホルダー色: `Colors.placeholder`（`#4A6A8C`）
- secureTextEntry 時: eye/eye-off アイコン（22px）で表示切替

### CredentialCard

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| serviceName | string | YES | サービス名 |
| accountId | string \| null | YES | アカウントID（null時はサブテキスト非表示） |
| onPress | () => void | YES | タップ時コールバック |
| drag | () => void | NO | ドラッグ開始コールバック（長押しで発火） |
| isActive | boolean | NO | ドラッグ中フラグ |

- ドラッグハンドル: `reorder-three` アイコン（24px、左側、`drag` 指定時のみ表示）
- ドラッグ中: 背景 `Colors.cardElevated`、影増大、opacity 0.9
- アカウントID が null の場合、サブテキスト行を非表示

### PasswordField

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| label | string | YES | ラベル |
| value | string \| null | YES | パスワード/PIN値 |

- 値あり: マスク表示（●●●●●●●●）+ 表示切替 + コピーボタン
- 値なし: 「未登録」表示
- コピー成功: 緑チェック + 「コピーしました」（1.5秒間）

### SearchBar

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| value | string | YES | 検索文字列 |
| onChangeText | (text: string) => void | YES | テキスト変更コールバック |
| placeholder | string | NO | プレースホルダー（default: "サービス名で検索"） |

- 検索アイコン（左）+ クリアボタン（右、入力時のみ）
- 高さ: 48px、角丸: 12px

### ErrorBanner

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| message | string | YES | エラーメッセージ |

- 背景: `Overlays.dangerLight`、ボーダー: `Overlays.dangerBorder`
- テキスト: 赤、18px、中央寄せ

---

## 9. カスタムフック

### useAuth()

**Context 経由で認証状態を提供:**

| 戻り値 | 型 | 説明 |
|--------|-----|------|
| session | Session \| null | Supabase セッション |
| user | User \| null | ログインユーザー |
| isLoading | boolean | 認証状態の初期化中 |
| isLoggedIn | boolean | ログイン済みフラグ |
| signOut | () => Promise<void> | ログアウト関数 |

- `_layout.tsx` で `useAuthProvider()` → `AuthContext.Provider` で全画面に共有
- `onAuthStateChange`: `access_token` 重複チェックで二重レンダリング防止

### useCredentials()

| 関数 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| listCredentials | — | Promise<CredentialSummary[]> | 自分のクレデンシャル一覧（display_order ASC） |
| listSharedCredentials | — | Promise<CredentialSummary[]> | 家族の共有データ一覧 |
| getCredential | id: string | Promise<Credential> | 復号済み完全データ取得 |
| createCredential | form: CredentialFormData | Promise<Credential> | 新規作成（display_order: 0） |
| updateCredential | id, form | Promise<Credential> | 更新（再暗号化） |
| updateCredentialOrder | items: {id, display_order}[] | Promise<void> | 並び順一括更新 |
| deleteCredential | id: string | Promise<void> | 削除 |

- 全関数はエラー時に throw（内部 state なし）
- 画面側で try-catch してエラーを管理

### useFamilyShare()

| 関数 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| getMyShare | — | Promise<FamilyShareInfo \| null> | 自分の共有情報取得 |
| getSharedFrom | — | Promise<SharedFromInfo \| null> | 家族から受け取った共有情報 |
| createInvite | — | Promise<FamilyShareInfo> | 招待コード生成 |
| acceptInvite | code: string | Promise<void> | 招待を受諾 |
| revokeShare | shareId: string | Promise<void> | 共有を解除 |

---

## 10. ユーティリティ

### lib/supabase.ts

- Supabase クライアント初期化
- ストレージアダプター: ネイティブは `expo-secure-store`、Web は `localStorage`
- `autoRefreshToken: true` / `persistSession: true`

### lib/auth.ts

- `signInWithGoogle()`: プラットフォーム別の Google OAuth フロー
  - Web: フルページリダイレクト
  - ネイティブ: アプリ内ブラウザ → トークン手動設定

### lib/platform.ts

- `confirmDialog(title, message, onConfirm)`: クロスプラットフォーム確認ダイアログ
  - Web: `window.confirm()`
  - ネイティブ: `Alert.alert()` + Cancel/OK ボタン

---

## 11. エラーハンドリング方針

| レイヤー | パターン | 詳細 |
|---------|---------|------|
| Hook | throw のみ | 内部に `isLoading` / `error` state を持たない |
| 画面 | try-catch | ローカル state でエラーメッセージを管理 |
| 表示 | ErrorBanner | 全画面で統一使用（個別スタイル禁止） |

### 主なエラーメッセージ

| 状況 | メッセージ |
|------|-----------|
| 暗号化失敗 | 「暗号化に失敗しました: {詳細}」 |
| 復号失敗 | 「復号に失敗しました: {詳細}」 |
| 保存失敗 | 「保存に失敗しました。もう一度お試しください。」 |
| データ取得失敗 | 「データの取得に失敗しました」 |
| 並び替え保存失敗 | 「並び替えの保存に失敗しました」 |
| 招待重複 | 「すでに招待が存在します。先に解除してください。」 |
| 共有解除失敗 | 「共有の解除に失敗しました」 |
| ログイン必須 | 「ログインが必要です」 |

---

## 12. ナビゲーションパターン

| シーン | パターン | 理由 |
|--------|---------|------|
| 保存/削除後 | `setTimeout(() => router.back(), 50)` | Hook の cleanup と競合回避 |
| キャンセル/戻る | 即座に `router.back()` | ユーザー操作は遅延不要 |
| 認証後 | `onAuthStateChange` → Redirect | 認証ガードが自動処理 |

---

## 13. クロスプラットフォーム対応

| 機能 | iOS / Android | Web |
|------|--------------|-----|
| 認証 | アプリ内ブラウザ OAuth | フルページリダイレクト |
| トークン保存 | expo-secure-store | localStorage |
| 確認ダイアログ | Alert.alert() | window.confirm() |
| 影 | elevation (Android) | boxShadow CSS |
| キーボード | KeyboardAvoidingView + pan | デフォルト |
| 共有 | Share API | Share API (対応ブラウザ) |

---

## 14. セキュリティ

| 項目 | 対策 |
|------|------|
| パスワード/PIN暗号化 | AES-256 サーバーサイド（pgcrypto） |
| 暗号化キー管理 | Supabase Vault（クライアントに露出しない） |
| データアクセス制御 | RLS（本人CRUD + 家族閲覧のみ） |
| トークン保存 | expo-secure-store（ネイティブ） |
| 環境変数 | `EXPO_PUBLIC_*` のみクライアント露出、秘密情報は EAS Secrets |
| RPC関数 | SECURITY DEFINER + SET search_path = public |

---

## 15. 開発フェーズ履歴

| フェーズ | 内容 |
|---------|------|
| Phase 1 | 環境構築、DB設計、テーマ・UI基盤、Google OAuth認証 |
| Phase 2 | CRUD、一覧検索、タブナビゲーション |
| Phase 3 | 家族共有（招待コード、閲覧専用、共有解除） |
| Phase 4 | EAS Build APK配布、セットアップ手順書 |
| Phase 5 | UIリデザイン（ダークネイビー × ゴールド、M PLUS Rounded 1c フォント） |
| Phase 6 | リファクタリング（ErrorBanner抽出、confirmDialog統一、Hook整理、Overlays定数化、Supabase RLS/関数最適化） |
| 追加改善 | プレースホルダー色改善、アカウントID空時の表示改善、ドラッグ&ドロップ並び替え |
