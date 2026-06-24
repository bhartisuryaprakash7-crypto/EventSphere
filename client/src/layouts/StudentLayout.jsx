import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const StudentLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar with student role */}
      <Sidebar role="student" />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Navbar />
        <main className="p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;