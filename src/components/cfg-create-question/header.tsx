import { Logo } from "./logo";

// Header Component
export function Header() {
  return (
    <header className="bg-yellow-400 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12">
            <Logo />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center flex-1">Mysteria</h1>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">Raditsss</span>
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            {/* Profile picture would go here */}
          </div>
        </div>
      </div>
    </header>
  );
}
