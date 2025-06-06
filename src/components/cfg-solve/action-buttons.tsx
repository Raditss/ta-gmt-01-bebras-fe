interface ActionButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSubmit: () => void;
}

export function ActionButtons({ onUndo, onRedo, onReset, onSubmit }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onUndo}
        className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
      >
        Undo
      </button>
      <button
        onClick={onRedo}
        className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
      >
        Redo
      </button>
      <button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Reset
      </button>
      <button
        onClick={onSubmit}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Submit
      </button>
    </div>
  );
} 