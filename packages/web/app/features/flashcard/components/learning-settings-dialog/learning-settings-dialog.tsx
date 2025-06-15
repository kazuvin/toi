import { useAtom } from "jotai";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { shuffleAtom, thoroughLearningAtom } from "~/state";
import { Shuffle, RotateCcw } from "lucide-react";

export function LearningSettingsDialog() {
  const [shuffle, setShuffle] = useAtom(shuffleAtom);
  const [thoroughLearning, setThoroughLearning] = useAtom(thoroughLearningAtom);

  return (
    <div className="space-y-6 py-4">
      {/* Shuffle Setting */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="shuffle-dialog"
            checked={shuffle}
            onCheckedChange={(checked) => setShuffle(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <Shuffle className="h-4 w-4 text-gray-500" />
            <Label htmlFor="shuffle-dialog" className="text-sm font-medium cursor-pointer">
              シャッフル
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-7">
          カードの表示順をランダムにします
        </p>
      </div>

      {/* Thorough Learning Setting */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="thorough-learning-dialog"
            checked={thoroughLearning}
            onCheckedChange={(checked) => setThoroughLearning(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-gray-500" />
            <Label htmlFor="thorough-learning-dialog" className="text-sm font-medium cursor-pointer">
              徹底学習
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-7">
          「NG」のカードを「OK」になるまで繰り返します
        </p>
      </div>
    </div>
  );
}