export type QuestionType =
  | "cfg"
  | "decision-tree"
  | "cipher-n"
  | "decision-tree-2"
  | "ring-cipher"

export interface QuestionTypeInfo {
  type: QuestionType;
  id: string;
  label: string;
  title: string;
  description: string;
  color: string;
}

export const QUESTION_TYPES: QuestionTypeInfo[] = [
  {
    type: "cfg",
    id: "cfg",
    label: "Context-Free Grammar",
    title: "Context-Free Grammar",
    description: "Transform shapes using grammar rules",
    color: "bg-blue-100 hover:bg-blue-200",
  },
  {
    type: "decision-tree",
    id: "decision-tree",
    label: "Decision Tree",
    title: "Decision Tree",
    description: "Build and analyze decision trees",
    color: "bg-green-100 hover:bg-green-200",
  },
  {
    type: "cipher-n",
    id: "cipher-n",
    label: "Cipher-n",
    title: "Cipher-n",
    description: "Solve encryption challenges using n-sided polygons",
    color: "bg-purple-100 hover:bg-purple-200",
  },
  {
    type: "decision-tree-2",
    id: "decision-tree-2",
    label: "Decision Tree 2",
    title: "Decision Tree 2",
    description: "Determine the finish of the character",
    color: "bg-red-100 hover:bg-red-200",
  },
  {
    type: "ring-cipher",
    id: "ring-cipher",
    label: "Ring Cipher",
    title: "Ring Cipher",
    description: "Solve encryption challenges using ring ciphers",
    color: "bg-orange-100 hover:bg-orange-200",
  },
];
