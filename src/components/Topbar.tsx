import MyAILogo from "./MyAILogo";
import Button from "./Button";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
      <MyAILogo />
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="hidden sm:inline"></span>
        {user && (
          <>
            <span className="text-gray-700">{user.email}</span>
            <Button variant="ghost" onClick={onLogout}>Log out</Button>
          </>
        )}
      </div>
    </header>
  );
}
