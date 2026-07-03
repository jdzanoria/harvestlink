import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HarvestLinkLanding from './pages/HarvestLink'; // Adjust if your file is named HarvestLink.jsx
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard'; //for farmerdasboard
import BuyerDashboard from './pages/BuyerDashboard'; //for buyerdashboard 

function App() {
  return (
    <Router>
      <Routes>
        {/* The main landing page */}
        <Route path="/" element={<HarvestLinkLanding />} />
        
        {/* The secure admin dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="*" element={<HarvestLinkLanding />} />
      </Routes>
    </Router>
  );
}

export default App;