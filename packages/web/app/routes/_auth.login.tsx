import { type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "ログイン - Toi" },
    { 
      name: "description", 
      content: "ToiにログインしてAIフラッシュカード作成機能をご利用ください。"
    }
  ];
};

export default function LoginPage() {
  return (
    <div>
      <h1>ログイン</h1>
    </div>
  );
}