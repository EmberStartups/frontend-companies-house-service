import JobListing from "./JobListing";


export default async function JobList() {

    const getJobs = async () => {
        try {
            const response = await fetch('https://y50zvty2m4.execute-api.eu-west-2.amazonaws.com/prod/jobs', {
                cache: 'no-store'
            }); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data['jobs'] || []; // Adjust based on your API response structure
        } catch (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }
    }

    console.log('Fetching jobs...');
    const jobs = await getJobs()

    // sort jobs by created_at in descending order and company_id 
    jobs.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime() || a.company_id.localeCompare(b.company_id);
    });


    console.log('Jobs fetched:', jobs);

    return <div className="flex flex-col items-center justify-center w-full space-y-2">

        {jobs.map((job) =>  <JobListing key={job['job_id']} job={job} />)}

    </div>
}