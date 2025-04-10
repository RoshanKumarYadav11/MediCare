"use client";
import { useNavigate } from "react-router-dom";
import { Hospital } from "lucide-react";
import Button from "../components/ui/Button";

const DashboardLayout = ({
  children,
  title,
  navItems,
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-600">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Medicare</span>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Sign Out
        </Button>
      </header>
      <nav className="bg-blue-700 text-white p-4">
        <ul className="flex space-x-4 justify-center">
          {navItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={activeTab === item.label ? "outline" : "ghost"}
                className={`hover:bg-white hover:text-blue-600 ${
                  activeTab === item.label
                    ? "bg-white text-blue-600"
                    : "text-white"
                }`}
                onClick={() => setActiveTab(item.label)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
