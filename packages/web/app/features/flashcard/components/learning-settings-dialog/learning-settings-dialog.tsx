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
        <Label 
          htmlFor="shuffle-dialog" 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          <Checkbox
            id="shuffle-dialog"
            checked={shuffle}
            onCheckedChange={(checked) => setShuffle(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <Shuffle className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              シャッフル
            </span>
          </div>
        </Label>
        <p className="text-xs text-gray-500 ml-9">
          カードの表示順をランダムにします
        </p>
      </div>

      {/* Thorough Learning Setting */}
      <div className="space-y-2">
        <Label 
          htmlFor="thorough-learning-dialog" 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          <Checkbox
            id="thorough-learning-dialog"
            checked={thoroughLearning}
            onCheckedChange={(checked) => setThoroughLearning(checked === true)}
          />
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              徹底学習
            </span>
          </div>
        </Label>
        <p className="text-xs text-gray-500 ml-9">
          「NG」のカードを「OK」になるまで繰り返します
        </p>
      </div>
    </div>
  );
}