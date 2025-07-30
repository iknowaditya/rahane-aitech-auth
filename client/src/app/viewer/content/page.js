"use client";

import { useEffect, useState } from "react";
import API from "../../api";
import useRoleGuard from "../../components/roleGuard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { setAuthToken } from "@/app/api";
import ApiDocs from "@/app/components/ApiDocs";

export default function ViewerContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useRoleGuard(user, ["viewer"]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token); // Set token for all future axios calls
    }

    if (!user || !token) return;
    API.get("/content")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to fetch posts"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[250px]" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-[100px]" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">View Content</h1>
        <p className="text-muted-foreground">
          Browse all available content as a viewer
        </p>
      </div>

      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map(({ _id, title, content, author, createdAt }) => (
            <Card key={_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Badge variant="outline" className="text-muted-foreground">
                  {author?.username || "Unknown"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No content available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                There are no posts to display at this time.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <ApiDocs />
    </div>
  );
}
