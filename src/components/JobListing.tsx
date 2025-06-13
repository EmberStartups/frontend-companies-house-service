

export default function JobListing({ job }: { 
    job: { 
        company_id: string,
        created_at: string,
        job_id: string,
        status: "COMPLETED" | "FAILED" | "PROCESSING" 
    } 
}) {

    return (
        <div className="flex border p-4 rounded-lg w-full justify-between items-center">
            <p className="text-gray-600 min-w-26">ID: {job.company_id}</p>
            <p className="text-gray-600">Time: {new Date(job.created_at).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric', 
                day: 'numeric'
            })}</p>
            <p className={`${job.status === "COMPLETED" ? "text-green-600" : job.status === "FAILED" ? "text-red-600" : "text-yellow-600"}`}>
                Status: {job.status}
            </p>
        </div>
    );

}