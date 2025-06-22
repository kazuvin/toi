import { type MetaFunction } from "@remix-run/react";
import { getCanonicalUrl } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "ログイン - Toi" },
    { 
      name: "description", 
      content: "ToiにログインしてAIフラッシュカード作成機能をご利用ください。"
    },
    {
      tagName: "link",
      rel: "canonical",
      href: getCanonicalUrl("/login")
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