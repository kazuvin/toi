import type { Meta, StoryObj } from "@storybook/react";
import { ContentList } from "./content-list";
import { GetSourcesResponse } from "@toi/shared/src/schemas/source";

const meta: Meta<typeof ContentList> = {
  title: "Features/Content/ContentList",
  component: ContentList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockContents: GetSourcesResponse = [
  {
    id: "1",
    uid: "user1",
    title: "React Hooksの基本",
    content: "React Hooksは関数コンポーネントでstateやライフサイクルメソッドを使用するための仕組みです。useState、useEffect、useContextなどがあります。",
    type: "TEXT",
    isFlashcardGenerated: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    uid: "user1",
    title: "TypeScriptの型システム",
    content: "TypeScriptは静的型付けをJavaScriptに追加した言語です。型安全性を高め、開発時のエラーを早期発見できます。",
    type: "TEXT",
    isFlashcardGenerated: false,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    uid: "user1",
    title: "CSS GridとFlexboxの違い",
    content: "CSS Gridは2次元レイアウト、Flexboxは1次元レイアウトに適しています。用途に応じて使い分けることが重要です。",
    type: "TEXT",
    isFlashcardGenerated: true,
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    uid: "user1",
    content: "無題のコンテンツです。タイトルが設定されていないコンテンツの例です。",
    type: "TEXT",
    isFlashcardGenerated: false,
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
];

export const Default: Story = {
  args: {
    contents: mockContents,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    contents: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    contents: [],
    isLoading: false,
  },
};

export const SingleItem: Story = {
  args: {
    contents: [mockContents[0]],
    isLoading: false,
  },
};

export const WithoutFlashcards: Story = {
  args: {
    contents: mockContents.map(content => ({
      ...content,
      isFlashcardGenerated: false,
    })),
    isLoading: false,
  },
};

export const WithLongContent: Story = {
  args: {
    contents: [
      {
        id: "long-1",
        uid: "user1",
        title: "非常に長いタイトルの例：React、TypeScript、Next.js、Tailwind CSSを使った現代的なWebアプリケーション開発について",
        content: "非常に長いコンテンツの例です。このコンテンツは複数行にわたって表示され、text-overflow: ellipsisによって適切に省略されることを確認するためのものです。実際のアプリケーションでは、ユーザーが入力したテキストが想定よりも長くなる場合があるため、このような表示の調整が重要になります。適切な省略処理により、ユーザーインターフェースの一貫性を保つことができます。",
        type: "TEXT",
        isFlashcardGenerated: true,
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-05T00:00:00Z",
      },
    ],
    isLoading: false,
  },
};