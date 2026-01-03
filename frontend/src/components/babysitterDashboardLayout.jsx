// components/BabysitterDashboardLayout.jsx
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { colors } from "../styles/designSystem";
import { useAuth } from "../contexts/AuthContext";

// Retiré "settings"
const menuItems = [
  { path: "requests", label: "Demandes", icon: "📩" },
  { path: "reviews", label: "Avis reçus", icon: "⭐" },
  { path: "profil", label: "Mon profil", icon: "👤" },
];

export default function BabysitterDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
  logout();
  navigate("/", { replace: true });
};

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
            Espace Baby-sitter
          </h2>
          <nav className="flex flex-col">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={`/baby-sitter/dashboard/${item.path}`}
                  className={`group relative flex items-center space-x-3 px-4 py-2 mb-2 rounded-md font-medium transition-all duration-200 ${
                    isActive
                      ? "text-black bg-orange-50"
                      : "text-gray-600 hover:text-black hover:bg-orange-100"
                  }`}
                >
                  <span
                    className="absolute left-0 top-0 h-full w-1 rounded-r transition-all duration-200 group-hover:bg-[color:var(--bar-color)]"
                    style={{
                      backgroundColor: isActive ? colors.primary : "transparent",
                      "--bar-color": colors.primaryLight || colors.primary,
                    }}
                  />
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-md transition font-medium text-red-500 hover:bg-red-50"
        >
          <span>🚪</span>
          <span>Se déconnecter</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
