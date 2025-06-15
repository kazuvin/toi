import { useAtom } from "jotai";
import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { shuffleAtom, thoroughLearningAtom } from "~/state";
import { Shuffle, RotateCcw } from "lucide-react";

export function LearningSettings() {
  const [shuffle, setShuffle] = useAtom(shuffleAtom);
  const [thoroughLearning, setThoroughLearning] = useAtom(thoroughLearningAtom);

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">学習設定</h3>
      
      <div className="space-y-4">
        {/* Shuffle Setting */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shuffle" className="flex items-center space-x-2 cursor-pointer">
              <Shuffle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-normal">シャッフル</span>
            </Label>
            <Switch
              id="shuffle"
              checked={shuffle}
              onCheckedChange={(checked) => setShuffle(checked)}
            />
          </div>
          <p className="text-xs text-gray-500 ml-6">
            カードの表示順をランダムにします
          </p>
        </div>

        {/* Thorough Learning Setting */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="thorough-learning" className="flex items-center space-x-2 cursor-pointer">
              <RotateCcw className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-normal">徹底学習</span>
            </Label>
            <Switch
              id="thorough-learning"
              checked={thoroughLearning}
              onCheckedChange={(checked) => setThoroughLearning(checked)}
            />
          </div>
          <p className="text-xs text-gray-500 ml-6">
            「NG」のカードを「OK」になるまで繰り返します
          </p>
        </div>
      </div>
    </Card>
  );
}