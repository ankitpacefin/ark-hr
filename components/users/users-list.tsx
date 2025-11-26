"use client";

import { useState, useEffect } from "react";
import { getUsers, updateUser } from "@/backend/actions/users";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data || []);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUser(userId, { role: newRole });
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success("Role updated");
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleAccessChange = async (userId: string, newAccess: boolean) => {
        try {
            await updateUser(userId, { access: newAccess });
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, access: newAccess } : user
                )
            );
            toast.success("Access updated");
        } catch (error) {
            toast.error("Failed to update access");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Access</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name || "—"}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onValueChange={(value) => handleRoleChange(user.id, value)}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hr">HR</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={user.access}
                                            onCheckedChange={(checked) => handleAccessChange(user.id, checked)}
                                        />
                                        <Badge variant={user.access ? "default" : "secondary"}>
                                            {user.access ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
