import { Outlet } from "react-router-dom";
import NavbarItemsList from "../components/navbar/NavbarItemList";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen"> 
      <NavbarItemsList />

      <div className="bg-gray-50 flex-1 flex items-center justify-center">
        <div className="w-full p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
