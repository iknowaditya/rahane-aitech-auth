"use client";
import { useEffect, useState } from "react";
import API from "../../api";
import useRoleGuard from "../../components/roleGuard";
import { useAuth } from "@/app/context/AuthContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { setAuthToken } from "@/app/api";
import ApiDocs from "@/app/components/ApiDocs";

export default function AdminUsers() {
  const { user } = useAuth();
  const [roleUpdateId, setRoleUpdateId] = useState(null);
  const [roleValue, setRoleValue] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useRoleGuard(user, ["admin"]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token); // Set token for all future axios calls
    }

    if (!user || !token) return;

    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, [user]);

  const updateRole = async (id) => {
    if (!roleValue) return;
    try {
      await API.put(`/users/${id}/role`, { role: roleValue });
      setUsers((users) =>
        users.map((u) => (u._id === id ? { ...u, role: roleValue } : u))
      );
      setRoleUpdateId(null);
      setRoleValue("");
    } catch {
      alert("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers((users) => users.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-md">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}. Manage your users here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(({ _id, username, role }) => (
                <TableRow key={_id}>
                  <TableCell className="font-medium">{username}</TableCell>
                  <TableCell>
                    {roleUpdateId === _id ? (
                      <Select
                        value={roleValue}
                        onValueChange={(value) => setRoleValue(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="capitalize">{role}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {roleUpdateId === _id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateRole(_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRoleUpdateId(null);
                            setRoleValue("");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRoleUpdateId(_id);
                            setRoleValue(role);
                          }}
                        >
                          Edit Role
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(_id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ApiDocs />
    </div>
  );
}
