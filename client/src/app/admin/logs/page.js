"use client";

import { useEffect, useState } from "react";
import API from "../../api";
import useRoleGuard from "../../components/roleGuard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import { setAuthToken } from "@/app/api";

export default function AdminLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useRoleGuard(user, ["admin"]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token); // Set token for all future axios calls
    }

    if (!user || !token) return;

    API.get("/logs")
      .then((res) => setLogs(res.data))
      .catch(() => alert("Failed to fetch logs"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">
          Audit trail of system activities and events
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="space-y-4 p-4">
              {logs.map(({ _id, message, user: logUser, timestamp, level }) => (
                <div
                  key={_id}
                  className="flex flex-col gap-1 border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          level === "error"
                            ? "destructive"
                            : level === "warning"
                            ? "warning"
                            : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {level || "info"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {logUser?.username || "System"}
                    </span>
                  </div>
                  <p className="text-sm">{message}</p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">No logs available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
