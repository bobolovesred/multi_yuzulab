import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Lobby } from './components/Lobby';
import { PhotoStudios } from './components/PhotoStudios';
import { Flowers } from './components/Flowers';
import { PhotoBooks } from './components/PhotoBooks';
import { MasterClasses } from './components/MasterClasses';
import { ShoppingCartProvider } from './contexts/ShoppingCartContext';
import FlowerDetail from './components/FlowerDetail';
import StudioDetail from './components/StudioDetail';
import MasterClassDetail from './components/MasterClassDetail';
import HallDetail from './components/HallDetail'; 
import { ProfilePage } from './components/ProfilePage';
import { CartPage } from './components/CartPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  // const initialLoadRef = useRef(true);

  // useEffect(() => {
  //   if (initialLoadRef.current) {
  //     initialLoadRef.current = false; 
  //     if (location.pathname !== '/') {
  //       navigate('/', { replace: true });
  //     }
  //   }
  // }, [location.pathname, navigate]);

  const isLobby = location.pathname === '/';
  const showNavbar = !isLobby;
  const showFooter = !isLobby;

  const mainContainerClasses = !isLobby ? 'container mx-auto px-4 sm:px-6 lg:px-8' : '';
  const mainPaddingClasses = showNavbar ? 'py-8 md:py-12' : '';

  return (
    <div className="flex flex-col min-h-screen bg-ui-background text-content-primary">
      {showNavbar && <Navbar />}
      <main className={`flex flex-col flex-grow ${mainContainerClasses} ${mainPaddingClasses}`}>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/photo-studios" element={<PhotoStudios />} />
          <Route path="/photo-studios/:studioId" element={<StudioDetail />} />
          <Route path="/flowers" element={<Flowers />} />
          <Route path="/flowers/:productId" element={<FlowerDetail />} />
          <Route path="/photobooks" element={<PhotoBooks />} />
          <Route path="/master-classes" element={<MasterClasses />} />
          <Route path="/master-classes/:eventId" element={<MasterClassDetail />} />
          <Route path="/master-classes/halls/:hallId" element={<HallDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ShoppingCartProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ShoppingCartProvider>
  );
};

export default App;