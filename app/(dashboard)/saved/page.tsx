import { getSavedApplicants } from "@/backend/actions/saved-applicants";
import { SavedApplicantRow } from "@/components/saved/saved-applicant-row";

export default async function SavedPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const { data: applicants } = await getSavedApplicants(page);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Saved Applicants</h1>
                <p className="text-muted-foreground">Applicants you have saved for later.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applicants?.map((applicant: any) => (
                    <SavedApplicantRow key={applicant.id} applicant={applicant} />
                ))}
                {applicants?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No saved applicants found.
                    </div>
                )}
            </div>
        </div>
    );
}
