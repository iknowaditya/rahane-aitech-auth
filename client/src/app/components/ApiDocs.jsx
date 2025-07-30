"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ApiDocs() {
  const { user } = useAuth();

  const authApis = [
    {
      method: "POST",
      endpoint: "/api/auth/register",
      description: "Register a new user",
      requestBody: {
        username: "string",
        password: "string",
        role: "string ('admin', 'editor', or 'viewer')",
      },
      response: {
        id: "string",
        username: "string",
        role: "string",
        token: "string (JWT)",
      },
    },
    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Login existing user",
      requestBody: {
        username: "string",
        password: "string",
      },
      response: {
        id: "string",
        username: "string",
        role: "string",
        token: "string (JWT)",
      },
    },
  ];

  const userManagementApis = [
    {
      method: "GET",
      endpoint: "/api/users",
      description: "List all users (Admin only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      response: [
        {
          _id: "string",
          username: "string",
          role: "string",
        },
      ],
    },
    {
      method: "PUT",
      endpoint: "/api/users/:id/role",
      description: "Update user role (Admin only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      requestBody: {
        role: "string",
      },
      response: {
        message: "string",
      },
    },
    {
      method: "DELETE",
      endpoint: "/api/users/:id",
      description: "Delete user (Admin only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      response: {
        message: "string",
      },
    },
  ];

  const contentApis = [
    {
      method: "GET",
      endpoint: "/api/content",
      description: "List all posts (All roles)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      response: [
        {
          _id: "string",
          title: "string",
          content: "string",
          author: {
            username: "string",
            role: "string",
          },
          createdAt: "ISO Date",
        },
      ],
    },
    {
      method: "POST",
      endpoint: "/api/content",
      description: "Create new post (Admin/Editor only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      requestBody: {
        title: "string",
        content: "string",
      },
      response: {
        _id: "string",
        title: "string",
        content: "string",
        author: "string",
        createdAt: "ISO Date",
      },
    },
    {
      method: "PUT",
      endpoint: "/api/content/:id",
      description: "Update post (Admin or owner only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      requestBody: {
        title: "string",
        content: "string",
      },
      response: {
        _id: "string",
        title: "string",
        content: "string",
        author: "string",
      },
    },
    {
      method: "DELETE",
      endpoint: "/api/content/:id",
      description: "Delete post (Admin or owner only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      response: {
        message: "string",
      },
    },
  ];

  const logApis = [
    {
      method: "GET",
      endpoint: "/api/logs",
      description: "List system logs (Admin only)",
      headers: {
        Authorization: "Bearer JWT_TOKEN",
      },
      response: [
        {
          _id: "string",
          message: "string",
          user: {
            username: "string",
          },
          timestamp: "ISO Date",
        },
      ],
    },
  ];

  const renderApiCard = (api) => (
    <Card key={api.endpoint} className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {api.method}
          </Badge>
          <CardTitle className="text-lg">{api.endpoint}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{api.description}</p>

        {api.headers && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Headers</h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(api.headers, null, 2)}
            </pre>
          </div>
        )}

        {api.requestBody && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Request Body</h4>
            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(api.requestBody, null, 2)}
            </pre>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Response</h4>
          <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(api.response, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="users">User Management</TabsTrigger>
          )}
          <TabsTrigger value="content">Content</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="auth">
          <ScrollArea className="h-[calc(100vh-220px)] pr-4">
            {authApis.map(renderApiCard)}
          </ScrollArea>
        </TabsContent>

        {user?.role === "admin" && (
          <TabsContent value="users">
            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
              {userManagementApis.map(renderApiCard)}
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="content">
          <ScrollArea className="h-[calc(100vh-220px)] pr-4">
            {contentApis
              .filter((api) => {
                return (
                  api.description.includes("All roles") ||
                  user?.role === "admin" ||
                  (user?.role === "editor" &&
                    !api.description.includes("Admin only"))
                );
              })
              .map(renderApiCard)}
          </ScrollArea>
        </TabsContent>

        {user?.role === "admin" && (
          <TabsContent value="logs">
            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
              {logApis.map(renderApiCard)}
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
