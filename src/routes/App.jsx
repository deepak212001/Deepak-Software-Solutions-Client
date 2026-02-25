import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../ui/Layout.jsx";
import LoginPage from "../ui/pages/LoginPage.jsx";
import MessagesPage from "../ui/pages/MessagesPage.jsx";
import NotFoundPage from "../ui/pages/NotFoundPage.jsx";
import ForbiddenPage from "../ui/pages/ForbiddenPage.jsx";
import RequireAuth from "../auth/RequireAuth.jsx";
import RequireRole from "../auth/RequireRole.jsx";

import AdminDashboardPage from "../ui/pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "../ui/pages/admin/AdminUsersPage.jsx";
import AdminClientCompaniesPage from "../ui/pages/admin/AdminClientCompaniesPage.jsx";
import AdminServicesPage from "../ui/pages/admin/AdminServicesPage.jsx";
import AdminRequestsPage from "../ui/pages/admin/AdminRequestsPage.jsx";
import AdminProjectsPage from "../ui/pages/admin/AdminProjectsPage.jsx";

import EmployeeProjectsPage from "../ui/pages/employee/EmployeeProjectsPage.jsx";
import ClientProjectsPage from "../ui/pages/client/ClientProjectsPage.jsx";
import ClientRequestsPage from "../ui/pages/client/ClientRequestsPage.jsx";
import ProfilePage from "../ui/pages/ProfilePage.jsx";
import HomePage from "../ui/pages/HomePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/messages"
          element={
            <RequireAuth>
              <MessagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminUsersPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/client-companies"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminClientCompaniesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/services"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminServicesPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminRequestsPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminProjectsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/employee/projects"
          element={
            <RequireAuth>
              <RequireRole roles={["employee"]}>
                <EmployeeProjectsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/client/projects"
          element={
            <RequireAuth>
              <RequireRole roles={["client"]}>
                <ClientProjectsPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/client/requests"
          element={
            <RequireAuth>
              <RequireRole roles={["client"]}>
                <ClientRequestsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}


