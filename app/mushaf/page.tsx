import MushafView from "@/Components/Quran/MushafView";
import { redirect } from "next/navigation";

type SearchParams = {
  chapter?: string;
};

const MushafPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;

  // Redirect to default if no chapter param
  if (!params.chapter) {
    redirect("/mushaf?chapter=1");
  }

  const chapterNumber = parseInt(params.chapter);

  return (
    <div>
      <MushafView chapterNumber={chapterNumber} />
    </div>
  );
};

export default MushafPage;
