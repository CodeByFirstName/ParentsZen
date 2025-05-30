import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { path: 'babysitters', label: 'Baby-sitters', icon: '👩‍🍼' },
  { path: 'favoris', label: 'Mes favoris', icon: '❤️' },
  { path: 'avis', label: 'Mes avis', icon: '📝' },
  { path: 'profil', label: 'Mon profil', icon: '👤' },
  { path: 'settings', label: 'Paramètres', icon: '⚙️' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background, color: colors.textDark }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
            Mon Dashboard
          </h2>
          <nav className="flex flex-col">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={`/parent/dashboard/${item.path}`}
                  className={`group relative flex items-center space-x-3 px-4 py-2 mb-2 rounded-md font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-black bg-orange-50'
                      : 'text-gray-600 hover:text-black hover:bg-orange-100'
                  }`}
                  style={{
                    position: 'relative',
                  }}
                >
                  {/* Barre gauche visible si actif ou hover */}
                  <span
                    className="absolute left-0 top-0 h-full w-1 rounded-r transition-all duration-200 group-hover:bg-[color:var(--bar-color)]"
                    style={{
                      backgroundColor: isActive ? colors.primary : 'transparent',
                      '--bar-color': colors.primaryLight || colors.primary,
                    }}
                  />
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
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
