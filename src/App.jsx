import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'
import Blogs from './Components/Blogs/Blogs'
import Contact from './Components/Contact/Contact'
import Aboutus from './Components/Aboutus/Aboutus'
import Login from './Components/Login/Login'
import Profile from './Components/Profile/Profile'
import AdminLogin from './Components/Admin/AdminLogin'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AddBlog from './Components/Admin/AddBlog/AddBlog'
import EditBlog from './Components/Admin/EditBlog/EditBlog'
import BlogDetail from './Components/Blogs/BlogDetail'
import SearchResults from './Components/Search/SearchResults'
import ScrollToTop from './Components/ScrollToTop'

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add ScrollToTop component to handle scroll restoration */}
      <ScrollToTop />
      
      {!isAdminRoute && <Header />}
      <main className={`${isAdminRoute ? 'min-h-screen bg-[#111827]' : 'flex-grow'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/blogs/add" element={<AddBlog />} />
          <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
