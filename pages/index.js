import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 `}
    >
      <div className="flex justify-center items-center  w-full" >
        <button onClick={() => router.push('/login')} className="cursor-pointer">Login</button>
      </div>
    </div>
  );
}
