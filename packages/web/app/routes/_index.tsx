import { redirect, type MetaFunction } from "@remix-run/react";
import { getCanonicalUrl } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Toi - AIでフラッシュカードを自動生成" },
    { 
      name: "description", 
      content: "テキストやPDFからAIが自動でフラッシュカードを生成。効率的な学習をサポートします。"
    },
    {
      tagName: "link",
      rel: "canonical",
      href: getCanonicalUrl("/")
    }
  ];
};

export async function clientLoader() {
  return redirect("/new");
}

export default function Index() {
  return null;
}
