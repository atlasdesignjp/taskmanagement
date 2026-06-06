# タスク管理アプリ 要件定義

## エンティティ

**Project（プロジェクト）**
- name（プロジェクト名）
- color（表示色）
- order（表示順）

**Task（タスク）**
- name（タスク名）
- projectId（プロジェクトID。未設定 = No Project）
- effort（工数、単位：h）
- dueDate（期日）
- completedAt（完了日時。null = 未完了）
- isTodayTask（今日フラグ）
- order（表示順）

---

## 機能

**Task（タスク）**
- 追加・編集・削除
- Project（プロジェクト）の所属変更
- Project（プロジェクト）内での並び替え
- isTodayTask（今日フラグ）の付け外し

**Project（プロジェクト）**
- 追加・編集・削除

---

## ビュー

| ビュー | 表示内容 |
|------|------|
| Today（今日） | isTodayTask が true のタスク |
| All（全タスク） | No Project セクションを先頭に、プロジェクトごとセクション表示 |
| Completed（完了済み） | completedAt が入っているタスクのみ |

---

## データ永続化

- ブラウザの localStorage に保存
- 認証なし・バックエンドなし
