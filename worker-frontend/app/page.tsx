import NextTask from "@/components/NextTask";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-2 pt-5">
        <p className="text-2xl font-medium text-center">Task Page</p>
       <NextTask/>
    </main>
  );
}
