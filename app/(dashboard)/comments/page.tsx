import { getAllComments } from "@/backend/actions/comments";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { CommentRow } from "@/components/comments/comment-row";

export default async function CommentsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const { data: comments } = await getAllComments(page);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
                <p className="text-muted-foreground">Recent activity and discussions.</p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="w-[40%]">Comment</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comments?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No comments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            comments?.map((comment: any) => (
                                <CommentRow key={comment.id} comment={comment} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
