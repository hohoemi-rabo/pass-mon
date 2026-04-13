# 014: タブナビゲーション拡張 — 4タブ構成 [DONE]

> Phase 2 | あんしんメモ機能

## 概要

既存の3タブ構成に「あんしんメモ」タブを追加し、4タブ構成にする。
Stack にメモ用ルート（memo/add、memo/[id]）を登録する。

## TODO

- [x] `app/(auth)/(tabs)/_layout.tsx` に「あんしんメモ」タブ追加（ホームと共有の間）
- [x] `app/(auth)/_layout.tsx` に `memo/add` と `memo/[id]` の Stack.Screen 追加

## タブ構成（変更後）

| 順番 | タブ名 | アイコン | 画面 |
|------|--------|---------|------|
| 1 | ホーム | home | index.tsx |
| 2 | あんしんメモ | heart | memos.tsx |
| 3 | 共有 | people | share.tsx |
| 4 | 設定 | settings-sharp | settings.tsx |

- アイコン・ラベルスタイルは既存タブと統一

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション2
