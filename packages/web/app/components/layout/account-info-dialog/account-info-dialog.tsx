import { ComponentPropsWithoutRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { User, CreditCard, Settings, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";

type AccountInfoDialogProps = ComponentPropsWithoutRef<typeof Dialog> & {
  isOpen: boolean;
  onClose: () => void;
};

function AccountInfoDialog({ isOpen, onClose, ...props }: AccountInfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>アカウント情報</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* ユーザー情報 */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Kazuvin</h3>
              <p className="text-sm text-muted-foreground">kazuvin@example.com</p>
            </div>
          </div>

          {/* プラン情報 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">プラン</span>
              <span className="text-sm text-muted-foreground">無料プラン</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">使用量</span>
              <span className="text-sm text-muted-foreground">5 / 10 コンテンツ</span>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              プランをアップグレード
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              設定
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccountInfoDialog;