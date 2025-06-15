import { useAtom } from "jotai";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { shuffleAtom, thoroughLearningAtom } from "~/state";
import { Shuffle, RotateCcw } from "lucide-react";

export function LearningSettings() {
  const [shuffle, setShuffle] = useAtom(shuffleAtom);
  const [thoroughLearning, setThoroughLearning] = useAtom(thoroughLearningAtom);

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">学習設定</h3>
      
      <div className="space-y-3">
        {/* Shuffle Setting */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="shuffle"
            checked={shuffle}
            onCheckedChange={(checked) => setShuffle(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <Shuffle className="h-4 w-4 text-gray-500" />
            <Label htmlFor="shuffle" className="text-sm font-normal cursor-pointer">
              シャッフル
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-7">
          カードの表示順をランダムにします
        </p>

        {/* Thorough Learning Setting */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="thorough-learning"
            checked={thoroughLearning}
            onCheckedChange={(checked) => setThoroughLearning(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-gray-500" />
            <Label htmlFor="thorough-learning" className="text-sm font-normal cursor-pointer">
              徹底学習
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-7">
          「NG」のカードを「OK」になるまで繰り返します
        </p>
      </div>
    </Card>
  );
}