# パスもん — 要件定義書

> **バージョン:** 1.0
> **日付:** 2026年4月11日
> **開発者:** ほほえみラボ（Hohoemi Labo）まさゆき
> **開発手法:** Claude Code バイブコーディング

---

## ① プロジェクト概要

| 項目       | 内容                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| アプリ名   | パスもん                                                                     |
| コンセプト | シニア向けアカウント・パスワード・PINコード管理アプリ                        |
| ターゲット | ほほえみラボの生徒（シニア約20名）およびその家族                             |
| 目的       | ノート管理からデジタル管理への移行。安全かつ簡単にアカウント情報を管理・共有 |
| 配布方法   | EAS BuildでAPKを生成し、ダウンロードリンクで直接配布（Play Store登録不要）   |
| 対応端末   | Android（メイン）・iOS（2名、TestFlight経由）                                |

---

## ② 背景・課題

### 現状の問題点

- 生徒さんがノートにアカウント情報を手書きしているが、字が読めないことがある
- ノートを忘れたときにログインできず困る
- PCのPINコードも管理が必要だが、ノートと混在して探しにくい
- もしもの時に家族がアカウント情報を確認できない

### パスもんが解決すること

- スマホでいつでもアカウント情報を確認できる
- 大きな文字とポップなUIで見やすく・使いやすい
- 暗号化された安全な保存でノートよりセキュア
- 家族が必要なときに閲覧できる共有機能

---

## ③ 技術スタック

| レイヤー         | 技術                                                                |
| ---------------- | ------------------------------------------------------------------- |
| フロントエンド   | Expo (React Native)                                                 |
| スタイリング     | NativeWind (Tailwind CSS)、アクセシビリティ重視                     |
| バックエンド・DB | Supabase (PostgreSQL)                                               |
| 認証             | Supabase Auth (Google OAuth) via expo-auth-session                  |
| 暗号化           | Supabase pgcrypto拡張によるサーバーサイドAES-256暗号化              |
| ビルド・配布     | EAS Build → APKダウンロードリンク配布（Android）、TestFlight（iOS） |

---

## ④ セキュリティ方針

パスワード管理アプリのため、セキュリティは最重要要件。

### 暗号化アーキテクチャ

- Supabaseのpgcrypto拡張を使用し、AES-256でサーバーサイド暗号化
- 暗号化キーはSupabaseの環境変数で管理（クライアントには保持しない）
- パスワードの復号はRow Level Security（RLS）で本人または共有先家族のみに制限
- 複数端末での同期が可能（機種変更時も安心）

### RLSポリシー

- ユーザーは自分のデータのみCRUD可能
- 共有先家族は「閲覧のみ」権限
- 管理者（まさゆきさん）もパスワード平文にはアクセス不可

---

## ⑤ 機能一覧（MVP）

### F1: 認証

- Googleアカウントでログイン（Supabase Auth + Google OAuth）
- ログイン後はトークンでセッション維持
- ログアウト機能

### F2: アカウント情報の登録・編集・削除

登録できる情報のフィールド：

| フィールド名     | 型                     | 備考                           |
| ---------------- | ---------------------- | ------------------------------ |
| サービス名       | テキスト（必須）       | 例：Gmail、Amazon、楽天        |
| アカウント（ID） | テキスト               | メールアドレスまたはユーザー名 |
| パスワード       | テキスト（暗号化保存） | AES-256で暗号化                |
| PINコード        | テキスト（暗号化保存） | PCログイン用など               |
| メモ             | テキスト（任意）       | 自由記入欄                     |

- サービス名のみ必須、他は任意入力
- パスワード・PINはタップで表示／非表示切り替え（目のアイコン）
- ワンタップでコピー（クリップボード）機能
- 削除時は確認ダイアログ表示

### F3: アカウント一覧表示

- カテゴリ分けなしのシンプルなリスト表示
- サービス名でのインクリメンタルサーチ（検索）
- 大きな文字サイズで見やすいカード型レイアウト
- 登録日時の降順で表示（最新が上）

### F4: 家族共有機能

「もしもの時」に家族がアカウント情報を閲覧できる機能。

#### 共有フロー

1. 生徒さんがアプリ内で「家族を招待」ボタンをタップ
2. 招待リンク（URL）がLINEやメールで共有される
3. 家族がアプリをインストールし、リンクからアクセス
4. 家族はGoogleアカウントでログイン後、閲覧のみ可能

#### 共有ルール

- 家族は「閲覧のみ」—— 編集・削除は不可
- 生徒さんはいつでも共有を解除可能
- 共有先は最大1人（MVP、将来拡張可能）

---

## ⑥ 画面構成

| 画面名         | 概要                       | 主な要素                                   |
| -------------- | -------------------------- | ------------------------------------------ |
| ログイン画面   | アプリ起動時の入口         | ロゴ、Googleログインボタン、キャッチコピー |
| ホーム（一覧） | 登録済みアカウント一覧     | 検索バー、カードリスト、追加FABボタン      |
| 新規登録画面   | アカウント情報の入力       | フォームフィールド×5、保存ボタン           |
| 詳細・編集画面 | アカウント情報の表示・編集 | 表示切替、コピー、編集・削除ボタン         |
| 家族共有設定   | 招待リンクの生成・解除     | 招待ボタン、共有状況表示、解除ボタン       |
| 設定画面       | アプリ設定                 | ログアウト、バージョン情報                 |

---

## ⑦ UI/UXデザイン方針

### デザインコンセプト

**「ポップで親しみやすく、見やすく、迷わない」**

### 具体的な方針

| 項目           | 方針                                               |
| -------------- | -------------------------------------------------- |
| フォントサイズ | 最小18px、見出しは22px以上                         |
| カラー         | 明るく温かい配色（オレンジ系アクセント）           |
| タップ領域     | 最小48x48dp（シニア対応）                          |
| レイアウト     | カード型UI、角丸、やさしい影                       |
| アニメーション | ボタンの微細なフィードバック（押した感）           |
| コントラスト   | WCAG AA準拠のコントラスト比                        |
| アイコン       | ポップでわかりやすいアイコン（鍵、目、コピーなど） |

### カラーパレット案

| 用途           | カラー                        |
| -------------- | ----------------------------- |
| プライマリ     | #FF8C42（温かいオレンジ）     |
| セカンダリ     | #4ECDC4（ポップなミント）     |
| 背景           | #FFF8F0（やわらかいクリーム） |
| カード背景     | #FFFFFF                       |
| テキスト       | #333333                       |
| サブテキスト   | #888888                       |
| 危険（削除等） | #FF6B6B                       |
| 成功           | #51CF66                       |

---

## ⑧ データベース設計

### profiles テーブル

| カラム       | 型          | 備考                   |
| ------------ | ----------- | ---------------------- |
| id           | UUID (PK)   | auth.users.idへの参照  |
| display_name | TEXT        | Googleアカウントの名前 |
| avatar_url   | TEXT        | Googleアバター画像     |
| created_at   | TIMESTAMPTZ | 登録日時               |

### credentials テーブル

| カラム             | 型              | 備考                        |
| ------------------ | --------------- | --------------------------- |
| id                 | UUID (PK)       | 自動生成                    |
| user_id            | UUID (FK)       | profiles.idへの参照         |
| service_name       | TEXT (NOT NULL) | サービス名                  |
| account_id         | TEXT            | アカウントID（暗号化）      |
| password_encrypted | TEXT            | パスワード（AES-256暗号化） |
| pin_encrypted      | TEXT            | PINコード（AES-256暗号化）  |
| memo               | TEXT            | メモ（平文）                |
| created_at         | TIMESTAMPTZ     | 登録日時                    |
| updated_at         | TIMESTAMPTZ     | 更新日時                    |

### family_shares テーブル

| カラム         | 型            | 備考                       |
| -------------- | ------------- | -------------------------- |
| id             | UUID (PK)     | 自動生成                   |
| owner_id       | UUID (FK)     | 共有元（生徒さん）         |
| shared_with_id | UUID (FK)     | 共有先（家族）             |
| invite_code    | TEXT (UNIQUE) | 招待コード                 |
| status         | TEXT          | pending / active / revoked |
| created_at     | TIMESTAMPTZ   | 作成日時                   |

---

## ⑨ RLSポリシー設計

### credentials テーブル

```sql
-- SELECT: 本人 または 共有先家族
CREATE POLICY "credentials_select" ON credentials FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM family_shares
    WHERE owner_id = credentials.user_id
    AND shared_with_id = auth.uid()
    AND status = 'active'
  )
);

-- INSERT: 本人のみ
CREATE POLICY "credentials_insert" ON credentials FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE: 本人のみ
CREATE POLICY "credentials_update" ON credentials FOR UPDATE
USING (user_id = auth.uid());

-- DELETE: 本人のみ
CREATE POLICY "credentials_delete" ON credentials FOR DELETE
USING (user_id = auth.uid());
```

### family_shares テーブル

```sql
-- SELECT: 共有元 または 共有先
CREATE POLICY "shares_select" ON family_shares FOR SELECT USING (
  owner_id = auth.uid() OR shared_with_id = auth.uid()
);

-- INSERT: 共有元のみ
CREATE POLICY "shares_insert" ON family_shares FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- DELETE: 共有元のみ
CREATE POLICY "shares_delete" ON family_shares FOR DELETE
USING (owner_id = auth.uid());
```

### 暗号化・SQL関数

```sql
-- pgcrypto拡張の有効化
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 暗号化関数
CREATE OR REPLACE FUNCTION encrypt_credential(plain_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(plain_text, current_setting('app.encryption_key')),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 復号関数（RLSを通過したユーザーのみ実行可能）
CREATE OR REPLACE FUNCTION decrypt_credential(cipher_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(cipher_text, 'base64'),
    current_setting('app.encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ⑩ 配布・運用計画

### EAS Buildでの配布方法

1. `eas build --platform android --profile preview` でAPKを生成
2. 生成されたAPKのダウンロードURLを生徒さんに共有（QRコード or LINE）
3. 生徒さんはリンクからAPKをダウンロードしてインストール
4. ホーム画面にアプリアイコンが追加される（通常のアプリと同じ使い勝手）

### iOS対応（2名）

- `eas build --platform ios --profile preview` でビルド
- TestFlight経由で配布（Apple Developer Program年間$99が必要）
- または、当面はExpo Goで対応し、必要に応じてTestFlightを検討

### EAS Build セットアップ手順

```bash
# EAS CLIのインストール
npm install -g eas-cli

# EASプロジェクトの初期化
eas init

# eas.json の設定（previewプロファイル）
# {
#   "build": {
#     "preview": {
#       "android": {
#         "buildType": "apk"
#       }
#     }
#   }
# }

# APKビルドの実行
eas build --platform android --profile preview
```

### 運用サポート

- 教室での初回セットアップ支援（APKインストール、Googleログイン、初回登録）
- ノートからアプリへの移行支援（一緒に登録作業）
- 家族共有の設定支援
- アプリ更新時は新しいAPKのダウンロードリンクを共有

---

## ⑪ 将来拡張（Phase 2以降）

- 生体認証（指紋・顔認証）によるアプリロック
- パスワード強度チェック機能
- パスワード自動生成機能
- サービスアイコンの自動表示（favicon取得）
- 家族共有の複数人対応
- データのCSVエクスポート（紙への印刷用）
- カテゴリ・タグ機能
- Play Store正式登録

---

## ⑫ 開発スケジュール（目安）

| フェーズ                | 期間  | 内容                                                   |
| ----------------------- | ----- | ------------------------------------------------------ |
| Phase 1: 環境構築       | 1週間 | Expoプロジェクト初期化、Supabaseセットアップ、認証実装 |
| Phase 2: コア機能       | 2週間 | CRUD画面、暗号化、RLS、UI実装                          |
| Phase 3: 家族共有       | 1週間 | 招待フロー、共有閲覧画面                               |
| Phase 4: ビルド・テスト | 1週間 | EAS Build、APK配布、教室でのテスト、フィードバック反映 |

**合計約5週間**（Claude Codeでのバイブコーディング想定）

---

## ⑬ プロジェクト構成（参考）

```
pasumon/
├── app/                    # Expo Router ファイルベースルーティング
│   ├── (auth)/             # 認証済みユーザー用画面
│   │   ├── _layout.tsx     # タブナビゲーション
│   │   ├── index.tsx       # ホーム（一覧）
│   │   ├── add.tsx         # 新規登録
│   │   ├── [id].tsx        # 詳細・編集
│   │   ├── share.tsx       # 家族共有設定
│   │   └── settings.tsx    # 設定
│   ├── login.tsx           # ログイン画面
│   └── _layout.tsx         # ルートレイアウト
├── components/             # 共通コンポーネント
│   ├── CredentialCard.tsx   # アカウントカード
│   ├── SearchBar.tsx       # 検索バー
│   └── PasswordField.tsx   # パスワード表示/非表示
├── lib/
│   ├── supabase.ts         # Supabaseクライアント
│   └── crypto.ts           # 暗号化ヘルパー
├── hooks/
│   ├── useAuth.ts          # 認証フック
│   └── useCredentials.ts   # CRUD操作フック
├── types/
│   └── database.ts         # Supabase型定義
├── app.json                # Expo設定
├── eas.json                # EAS Build設定
├── tailwind.config.js      # NativeWind設定
└── package.json
```
