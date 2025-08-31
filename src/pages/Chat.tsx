import { FormEvent, useRef, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAppStore } from "@/store/useAppStore";

export default function Chat() {
  const { chat, chatSending, sendChat } = useAppStore();
  const [msg, setMsg] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    await sendChat(msg.trim());
    setMsg("");
    // scroll to bottom
    setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 10);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">MyAI Chat</h2>
      <Card className="flex h-[60vh] flex-col">
        <div ref={listRef} className="flex-1 space-y-2 overflow-auto">
          {chat.length === 0 && (
            <div className="text-sm text-gray-500">Say hi — I’ll echo back for now :)</div>
          )}
          {chat.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.from === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-100 text-gray-900"
              }`}
              title={new Date(m.ts).toLocaleString()}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button type="submit" disabled={chatSending}>
            {chatSending ? "Sending…" : "Send"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
