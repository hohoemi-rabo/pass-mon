# 013: コンポーネント — AnshinMemoCard

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモ一覧で使用するカードコンポーネントを作成する。
CredentialCard と同じ基本構造（Card ベース + ドラッグ対応）。

## TODO

- [ ] `components/AnshinMemoCard.tsx` 作成
- [ ] heart アイコン（20px、`Colors.secondary`）でパスワードカードと視覚的に差別化
- [ ] タイトル表示（18px bold）
- [ ] 本文プレビュー（16px、subtext、最大2行 `numberOfLines={2}`）
- [ ] ドラッグハンドル対応（`drag` / `isActive` props）
- [ ] ドラッグ中の視覚フィードバック（背景 cardElevated、影増大）

## Props

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | YES | メモのタイトル |
| body | string | YES | メモの本文（プレビュー用） |
| onPress | () => void | YES | タップ時コールバック |
| drag | () => void | NO | ドラッグ開始コールバック |
| isActive | boolean | NO | ドラッグ中フラグ |

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション5.2
- 既存パターン: `components/CredentialCard.tsx`
