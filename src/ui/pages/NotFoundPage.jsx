import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/Card.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Page not found" subtitle="The page you’re looking for doesn’t exist." />
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-700">Try navigating back to a known page.</div>
          <Button as={Link} to="/login" variant="outline">
            Go to login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


