import { useAtom } from "jotai";
import { Switch } from "~/components/ui/switch";
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
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
          <Label 
            htmlFor="shuffle-dialog" 
            className="flex items-center space-x-2 cursor-pointer flex-1"
          >
            <Shuffle className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              シャッフル
            </span>
          </Label>
          <Switch
            id="shuffle-dialog"
            checked={shuffle}
            onCheckedChange={(checked) => setShuffle(checked)}
          />
        </div>
        <p className="text-xs text-gray-500 ml-8">
          カードの表示順をランダムにします
        </p>
      </div>

      {/* Thorough Learning Setting */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
          <Label 
            htmlFor="thorough-learning-dialog" 
            className="flex items-center space-x-2 cursor-pointer flex-1"
          >
            <RotateCcw className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              徹底学習
            </span>
          </Label>
          <Switch
            id="thorough-learning-dialog"
            checked={thoroughLearning}
            onCheckedChange={(checked) => setThoroughLearning(checked)}
          />
        </div>
        <p className="text-xs text-gray-500 ml-8">
          「NG」のカードを「OK」になるまで繰り返します
        </p>
      </div>
    </div>
  );
}