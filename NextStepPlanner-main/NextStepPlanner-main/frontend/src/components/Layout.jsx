import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Timer,
  Smile,
  FileText,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Planner", href: "/planner", icon: Calendar },
  { name: "Pomodoro", href: "/pomodoro", icon: Timer },
  { name: "Mood", href: "/mood", icon: Smile },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Skills", href: "/skills", icon: BookOpen },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg border-r border-border">
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Logo size="md" showText={false} />
          <ThemeToggle />
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full mr-3">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
