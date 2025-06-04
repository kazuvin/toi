import { useState } from "react";

export type OutputFormatType =
  | "flashcard"
  | "multipleChoice"
  | "fillInTheBlank"
  | "essay";

export type OutputFormats = Record<OutputFormatType, boolean>;

export function useOutputFormats() {
  const [outputFormats, setOutputFormats] = useState<OutputFormats>({
    flashcard: false,
    multipleChoice: false,
    fillInTheBlank: false,
    essay: false,
  });

  const toggleOutputFormat = (format: OutputFormatType) => {
    setOutputFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  const hasSelectedFormats = Object.values(outputFormats).some(
    (value) => value
  );

  const getSelectedFormats = (): OutputFormatType[] => {
    return Object.entries(outputFormats)
      .filter(([, isSelected]) => isSelected)
      .map(([format]) => format as OutputFormatType);
  };

  return {
    outputFormats,
    toggleOutputFormat,
    hasSelectedFormats,
    getSelectedFormats,
  };
}
