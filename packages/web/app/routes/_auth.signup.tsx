import { type MetaFunction } from "@remix-run/react";
import { getCanonicalUrl } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "新規登録 - Toi" },
    { 
      name: "description", 
      content: "Toiに新規登録してAIフラッシュカード作成機能を始めましょう。"
    },
    {
      tagName: "link",
      rel: "canonical",
      href: getCanonicalUrl("/signup")
    }
  ];
};

export default function SignupPage() {
  return (
    <div>
      <h1>新規登録</h1>
    </div>
  );
}