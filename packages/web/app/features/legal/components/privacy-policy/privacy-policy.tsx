import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
        <p className="text-muted-foreground">
          最終更新日: 2024年12月17日
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. はじめに</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Toi（以下「当サービス」）は、ユーザーのプライバシーを重視し、個人情報の保護に努めています。
            本プライバシーポリシーは、当サービスにおける個人情報の収集、使用、開示について説明します。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. 収集する情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">2.1 アカウント情報</h3>
            <p>
              ユーザー登録時に、メールアドレス、ユーザー名などの基本情報を収集します。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2.2 学習コンテンツ</h3>
            <p>
              ユーザーが作成・アップロードした学習コンテンツ、フラッシュカード、学習履歴を収集・保存します。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2.3 利用データ</h3>
            <p>
              サービスの利用状況、アクセスログ、端末情報などの技術的な情報を自動的に収集する場合があります。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. 情報の利用目的</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>収集した個人情報は以下の目的で利用します：</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>サービスの提供・運営</li>
            <li>ユーザーサポート・問い合わせ対応</li>
            <li>サービスの改善・新機能の開発</li>
            <li>利用規約違反の監視・対応</li>
            <li>重要なお知らせの配信</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. 第三者への提供</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            当サービスは、法令に基づく場合やユーザーの同意がある場合を除き、
            個人情報を第三者に提供することはありません。
          </p>
          <div>
            <h3 className="font-semibold mb-2">4.1 外部サービスの利用</h3>
            <p>
              当サービスでは、機能向上のため以下の外部サービスを利用する場合があります：
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>AI サービス（学習コンテンツ生成・分析）</li>
              <li>クラウドストレージサービス</li>
              <li>分析ツール</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. データの保存・セキュリティ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            ユーザーの個人情報は、適切なセキュリティ対策を講じて保存・管理しています。
            不正アクセス、情報漏洩、改ざん、滅失などを防ぐため、技術的・組織的対策を実施しています。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. ユーザーの権利</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>ユーザーは以下の権利を有します：</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>個人情報の開示・訂正・削除の請求</li>
            <li>個人情報の利用停止の請求</li>
            <li>アカウントの削除</li>
          </ul>
          <p>
            これらの権利を行使される場合は、サポートまでお問い合わせください。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Cookie・ローカルストレージ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            当サービスでは、ユーザーエクスペリエンスの向上のため、
            Cookie や ローカルストレージを使用する場合があります。
            これらの技術により、ログイン状態の維持や設定の保存を行います。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. 未成年者の個人情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            13歳未満の方は当サービスを利用できません。
            13歳以上18歳未満の方が当サービスを利用される場合は、
            保護者の同意が必要です。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. プライバシーポリシーの変更</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            当サービスは、必要に応じてプライバシーポリシーを変更する場合があります。
            重要な変更については、サービス内で事前にお知らせします。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. お問い合わせ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            プライバシーポリシーに関するご質問やお問い合わせは、
            サービス内のサポート機能をご利用ください。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}