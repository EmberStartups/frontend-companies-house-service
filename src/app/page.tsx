import BoardJobs from "@/components/JobList";
import RequestJob from "@/components/JobRequest";

export default function Home() {
  return (
    <main
        className="w-full flex flex-col space-y-16 justify-center p-24"
    >
        <RequestJob/>
        <BoardJobs/>
    </main>
  );
}
