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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { setAuthToken } from "@/app/api";
import ApiDocs from "@/app/components/ApiDocs";

export default function EditorContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useRoleGuard(user, ["admin", "editor"]);

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

  const submitPost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      if (editingPostId) {
        const res = await API.put(`/content/${editingPostId}`, {
          title,
          content,
        });
        setPosts((posts) =>
          posts.map((p) => (p._id === editingPostId ? res.data : p))
        );
      } else {
        const res = await API.post("/content", { title, content });
        setPosts((posts) => [res.data, ...posts]);
      }
      setTitle("");
      setContent("");
      setEditingPostId(null);
    } catch {
      alert("Failed to save post");
    }
  };

  const editPost = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deletePost = async () => {
    if (!postToDelete) return;

    try {
      await API.delete(`/content/${postToDelete}`);
      setPosts((posts) => posts.filter((p) => p._id !== postToDelete));
    } catch {
      alert("Failed to delete post");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-[150px]" />
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
              <CardFooter className="gap-2">
                <Skeleton className="h-9 w-[70px]" />
                <Skeleton className="h-9 w-[70px]" />
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
        <h1 className="text-3xl font-bold tracking-tight">Manage Content</h1>
        <p className="text-muted-foreground">
          {user?.role === "admin"
            ? "Create and manage all content"
            : "Create and edit your content"}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editingPostId ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitPost} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
            <div className="flex gap-2">
              <Button type="submit">
                {editingPostId ? "Update Post" : "Create Post"}
              </Button>
              {editingPostId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingPostId(null);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">All Posts</h2>
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
              <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    {author?.username || "Unknown"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {createdAt && new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                {(user?.role === "admin" || author?._id === user?.id) && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPost({ _id, title, content })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(_id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No posts available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create your first post using the form above.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ApiDocs />
    </div>
  );
}
