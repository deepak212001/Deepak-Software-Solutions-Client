import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../auth/AuthProvider.jsx";

function otherParticipant(convo, myId) {
  const parts = convo?.participants || [];
  return parts.find((p) => String(p._id) !== String(myId)) || null;
}

export default function MessagesPage() {
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState("");

  async function loadSidebar() {
    const [c, conv] = await Promise.all([apiFetch("/api/messages/contacts"), apiFetch("/api/messages/conversations")]);
    setContacts(c.contacts || []);
    setConversations(conv.conversations || []);
  }

  async function loadMessages(conversationId) {
    if (!conversationId) return;
    const data = await apiFetch(`/api/messages/conversations/${conversationId}/messages`);
    setMessages(data.messages || []);
  }

  useEffect(() => {
    loadSidebar().catch((e) => setError(e?.message || "Failed to load messages"));
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }
    loadMessages(selectedConversationId).catch((e) => setError(e?.message || "Failed to load messages"));
  }, [selectedConversationId]);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => `${c.name} ${c.email} ${c.role}`.toLowerCase().includes(q));
  }, [contacts, search]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => String(c._id) === String(selectedConversationId)) || null,
    [conversations, selectedConversationId]
  );

  const selectedOther = otherParticipant(selectedConversation, user?.id || user?._id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="mt-2 text-sm text-slate-600">
          Admin ↔ Employee, Admin ↔ Client, and Client ↔ Employee (only when assigned via projects).
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Contacts</div>
            <button
              type="button"
              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
              onClick={() => loadSidebar().catch((e) => setError(e?.message || "Refresh failed"))}
            >
              Refresh
            </button>
          </div>
          <input
            className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-3 space-y-2">
            {filteredContacts.map((c) => (
              <button
                key={c._id}
                type="button"
                className="w-full rounded-lg border p-3 text-left hover:bg-slate-50"
                onClick={async () => {
                  setError("");
                  try {
                    const res = await apiFetch("/api/messages/conversations", {
                      method: "POST",
                      body: { participantId: String(c._id) },
                    });
                    await loadSidebar();
                    setSelectedConversationId(String(res.id));
                  } catch (e) {
                    setError(e?.message || "Failed to start conversation");
                  }
                }}
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="mt-0.5 text-xs text-slate-600">
                  {c.role} • {c.email}
                </div>
              </button>
            ))}
            {filteredContacts.length === 0 ? (
              <div className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">No contacts found.</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">
                {selectedOther ? `Chat with ${selectedOther.name}` : "Conversation"}
              </div>
              {selectedOther ? (
                <div className="mt-1 text-xs text-slate-600">
                  {selectedOther.role} • {selectedOther.email}
                </div>
              ) : (
                <div className="mt-1 text-xs text-slate-600">Start a chat by selecting a contact.</div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Threads:</span>
              <select
                className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={selectedConversationId}
                onChange={(e) => setSelectedConversationId(e.target.value)}
              >
                <option value="">Select…</option>
                {conversations.map((c) => {
                  const other = otherParticipant(c, user?.id || user?._id);
                  return (
                    <option key={c._id} value={String(c._id)}>
                      {other?.name || "Conversation"}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-4 h-[360px] overflow-y-auto rounded-xl border bg-slate-50 p-4">
            {selectedConversationId ? (
              <div className="space-y-3">
                {messages.map((m) => {
                  const mine = String(m.sender?._id) === String(user?.id || user?._id);
                  return (
                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl border bg-white p-3 shadow-sm`}>
                        <div className="text-xs text-slate-500">
                          {mine ? "You" : m.sender?.name || "User"} •{" "}
                          {m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{m.body}</div>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 ? (
                  <div className="text-sm text-slate-600">No messages yet.</div>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-slate-600">Select a thread to view messages.</div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
              placeholder="Type a message…"
              value={messageBody}
              disabled={!selectedConversationId || isSending}
              onChange={(e) => setMessageBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit?.();
                }
              }}
            />
            <button
              type="button"
              disabled={!selectedConversationId || isSending || !messageBody.trim()}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={async () => {
                if (!selectedConversationId) return;
                const body = messageBody.trim();
                if (!body) return;
                setError("");
                setIsSending(true);
                try {
                  await apiFetch(`/api/messages/conversations/${selectedConversationId}/messages`, {
                    method: "POST",
                    body: { body },
                  });
                  setMessageBody("");
                  await Promise.all([loadMessages(selectedConversationId), loadSidebar()]);
                } catch (e) {
                  setError(e?.message || "Failed to send message");
                } finally {
                  setIsSending(false);
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



