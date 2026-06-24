import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const FacultyLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar with faculty role */}
      <Sidebar role="faculty" />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Centralised Header/Navbar */}
        <Navbar />
        
        {/* Dynamic Nested Page Content */}
        <main className="p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;