import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button>Click me</Button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Button>Click me</Button>
      </footer>
    </div>
  );
}
