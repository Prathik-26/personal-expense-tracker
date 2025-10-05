import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
        <Button>Test Button</Button>
      </div>
    </main>
  );
}
