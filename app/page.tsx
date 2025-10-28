import Navbar from "@/Components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Welcome to AutoQuran</h1>
      </div>
    </>
  );
}
