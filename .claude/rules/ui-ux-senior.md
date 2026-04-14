---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "constants/**/*.ts"
---

# UI/UX ルール（シニア対応）

## デザインコンセプト

「上品で落ち着いた、スタイリッシュで迷わない」
ダークネイビー × ウォームゴールドの配色で、高級感と視認性を両立。

## フォント

- **M PLUS Rounded 1c**（丸ゴシック）をグローバル適用
- `_layout.tsx` の `Text.render` パッチで全 Text に自動適用（個別指定不要）
- `style` で直接指定する場合は `FontFamily` 定数を使用（`constants/theme.ts`）
  - `FontFamily.regular`（400）: 本文
  - `FontFamily.medium`（500）: ボタン、ラベル
  - `FontFamily.bold`（700）: 見出し
- NativeWind の `font-semibold` 等はウェイトのみ変更（fontFamily はデフォルトパッチで適用済み）

## サイズ・アクセシビリティ

- フォントサイズ最小18px、見出し22px以上
- タップ領域最小48x48dp
- WCAG AA準拠のコントラスト比
- カード型UI、角丸16px、サブトルなボーダー（`Overlays.cardBorder`）

## カラーパレット

| 用途 | カラー |
|------|--------|
| プライマリ | `#D4A056`（ウォームゴールド） |
| プライマリDark | `#B8893E` |
| セカンダリ | `#5BBFB8`（ソフトティール） |
| セカンダリDark | `#4AA9A2` |
| 背景 | `#091b36`（ダークネイビー） |
| カード背景 | `#0d2847`（ネイビーサーフェス） |
| カード高 | `#112f52`（エレベーテッドサーフェス） |
| テキスト | `#FFFFFF` |
| サブテキスト | `#8BA3C4`（ブルーグレー） |
| ボーダー | `#1A3556` |
| 入力ボーダー | `#2A4A6E` |
| 入力フォーカス | `#D4A056`（ゴールド） |
| プレースホルダー | `#4A6A8C`（薄めブルーグレー） |
| タブバー | `#061527`（ディープネイビー） |
| 危険（削除等） | `#FF6B6B` |
| 成功 | `#51CF66` |

## オーバーレイ色（`Overlays` 定数）

RGBA のハードコード禁止。`constants/theme.ts` の `Overlays` を使用:

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

## 共通コンポーネント

- **ErrorBanner** (`components/ErrorBanner.tsx`): エラーメッセージ表示。個別にスタイルを書かず必ずこれを使う
- **Header** (`components/Header.tsx`): `onBack` プロパティで戻る矢印を表示。Stack push 画面の閲覧モードで使用
- **TextInput** (`components/TextInput.tsx`): `secureTextEntry` で自動的にパスワード表示切替アイコンが付く。プレースホルダーは `Colors.placeholder`（`Colors.subtext` より薄い）を使用し、入力済みテキストと明確に区別。パスワード登録・編集画面では `secureTextEntry` を使わず常に入力内容を表示（ログイン用ではなく管理アプリのため視認性を優先）
- **CredentialCard** (`components/CredentialCard.tsx`): `drag`/`isActive` props でドラッグ&ドロップ並び替え対応。ドラッグハンドル（`reorder-three` アイコン）を左側に表示。アカウントID未設定時はサブテキスト行を非表示（「IDなし」等のネガティブ表現を避ける）
- **AnshinMemoCard** (`components/AnshinMemoCard.tsx`): タイトルのみ表示（本文は暗号化のため一覧非表示）。heart アイコン（`Colors.secondary`）でパスワードカードと視覚的に差別化。ドラッグ対応
- **SegmentControl** (`components/SegmentControl.tsx`): ホーム画面のパスワード/あんしんメモ切替。ゴールドのアクティブインジケーター。タップ領域44dp以上

## ボタンスタイル

- **primary**: ゴールド塗りつぶし（`Colors.primary`）、ダークテキスト（`#1A1A2E`）
- **secondary**: ゴールドボーダー、透明背景、ゴールドテキスト
- **danger**: 赤ボーダー、半透明赤背景（`Overlays.dangerLight`）、赤テキスト
- **disabled**: ボーダー色背景（`Colors.border`）、opacity 0.5
- Button コンポーネントは NativeWind `className` を使わず純粋 `style` で実装（Web 競合回避）

## StatusBar

- `style="light"` を使用（ダーク背景のため）
