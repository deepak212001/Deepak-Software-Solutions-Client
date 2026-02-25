import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";
import { Card, CardContent } from "../components/Card.jsx";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Forbidden" subtitle="You don’t have access to this page." />
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-700">
            If you think this is a mistake, contact an administrator.
          </div>
          <Button as={Link} to="/" variant="royal">
            Go home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


