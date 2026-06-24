import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components & Layouts
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout'; 
import OrganizerLayout from './layouts/OrganizerLayout'; 
import FacultyLayout from './layouts/FacultyLayout'; 
import AdminLayout from './layouts/AdminLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Pages - Student
import StudentDashboard from './pages/student/Dashboard';
import BrowseEvents from './pages/student/BrowseEvents';
import StudentRegistrations from './pages/student/MyRegistrations';
import StudentCertificates from './pages/student/Certificates';
import StudentFeedback from './pages/student/Feedback';
import EventDetails from './pages/student/EventDetails';
import ScanAttendance from './pages/student/ScanAttendance';
import AttendanceMark from './pages/student/AttendanceMark';
import MyQRCode from './pages/student/MyQRCode';
import OrganizerAttendance from "./pages/organizer/Attendance";

// Pages - Organizer
import CreateEvent from './pages/organizer/CreateEvent';
import Attendance from './pages/organizer/Attendance';
import Analytics from './pages/organizer/Analytics';
import OrganizerDashboard from './pages/organizer/Dashboard';
import ManageEvents from './pages/organizer/ManageEvents';

// Pages - Faculty
import FacultyDashboard from './pages/faculty/Dashboard';
import Reports from './pages/faculty/Reports';
import EventApproval from './pages/faculty/EventApproval';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminVenues from './pages/admin/Venues';
import AdminDepartments from './pages/admin/Departments';
import AdminReports from './pages/admin/Reports';

// Pages - AI features (Fixed Imports Matching filenames & components)
import AIChat from './pages/ai/AIChat';
import FeedbackSummary from './pages/ai/FeedbackSummary';
import Recommendation from './pages/ai/Recommendation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />



          {/* Student Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
  <Route element={<StudentLayout />}>

    <Route path="/student/dashboard" element={<StudentDashboard />} />
    <Route path="/student/events" element={<BrowseEvents />} />
    <Route path="/student/event-details" element={<EventDetails />} />
    <Route path="/student/my-registrations" element={<StudentRegistrations />} />
    <Route path="/student/certificates" element={<StudentCertificates />} />
    <Route path="/student/feedback" element={<StudentFeedback />} />

    <Route path="/student/ai-chat" element={<AIChat />} />
    <Route path="/student/ai-feedback" element={<FeedbackSummary />} />
    <Route path="/student/ai-matches" element={<Recommendation />} />

    {/* QR Attendance */}
    <Route path="/student/scan" element={<ScanAttendance />} />
    <Route path="/student/attendance/:eventId" element={<AttendanceMark />} />

    {/* NEW ROUTE */}
    <Route
      path="/student/qr/:eventId"
      element={<MyQRCode />}
    />

  </Route>
</Route>
          {/* Organizer Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route element={<OrganizerLayout />}>
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/analytics" element={<Analytics />} />
              <Route path="/organizer/create" element={<CreateEvent />} />
            <Route 
  path="/organizer/attendance" 
  element={<OrganizerAttendance eventId="65c8a1b2e4b0f2a1c8f90123" />} 
/>
              <Route path="/organizer/manage" element={<ManageEvents />} />
            </Route>
          </Route>


<Route
    path="/student/qr/:eventId"
    element={<MyQRCode />}
/>


          {/* Faculty Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route element={<FacultyLayout />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/approval" element={<EventApproval />} />
              <Route path="/faculty/reports" element={<Reports />} /> 
            </Route>
          </Route>

          {/* Admin Routes (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/venues" element={<AdminVenues />} />
              <Route path="/admin/departments" element={<AdminDepartments />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;