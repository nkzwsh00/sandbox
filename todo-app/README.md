# TypeScript CLI Todoアプリ

TypeScript、Vitest、およびNode.jsを使用したコマンドラインインターフェースのTodoアプリです。

## 機能

- タスクの一覧表示
- 新しいタスクの追加
- タスクの詳細表示
- タスクの更新
- タスクの完了状態の切り替え
- タスクの削除

## インストール

```bash
# リポジトリをクローン
git clone [リポジトリURL]
cd todo-app

# 依存関係のインストール
yarn install

# アプリケーションのビルド
yarn build
```

## 使用方法

### タスク一覧表示

```bash
yarn start
# または
yarn start list
```

### 新しいタスクの追加

コマンドラインから直接追加:
```bash
yarn start add -t "新しいタスク"
```

対話形式での追加:
```bash
yarn start add
```

### タスクの詳細表示

```bash
yarn start get <タスクID>
```

### タスクの更新

コマンドラインから直接更新:
```bash
yarn start update <タスクID> -t "新しいタイトル"
```

対話形式での更新:
```bash
yarn start update <タスクID>
```

### タスクの完了状態を切り替え

```bash
yarn start toggle <タスクID>
```

### タスクの削除

確認付きでの削除:
```bash
yarn start delete <タスクID>
```

強制削除:
```bash
yarn start delete <タスクID> -f
```

## プロジェクト構造

```
todo-app/
├── src/               # ソースコード
│   ├── models/        # データモデル
│   ├── repositories/  # データ操作
│   ├── controllers/   # ビジネスロジック
│   └── index.ts       # エントリーポイント
├── tests/             # テストファイル
├── dist/              # ビルド成果物
├── data/              # データ保存ディレクトリ (自動生成)
└── package.json       # 依存関係と設定
```

## テスト

テストの実行:

```bash
yarn test
```

## 開発

開発モードでの実行:

```bash
yarn dev
```

## 技術スタック

- TypeScript - 型安全なコード
- Commander - CLIコマンド処理
- Inquirer - 対話式のユーザー入力
- Chalk - ターミナル出力のカラーリング
- Vitest - テストフレームワーク
