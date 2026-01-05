import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AuctionList } from './pages/AuctionList';
import { AuctionDetail } from './pages/AuctionDetail';
import { ShopList } from './pages/ShopList';
import { ShopDetail } from './pages/ShopDetail';
import { PostItem } from './pages/PostItem';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<AuctionList />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/shop" element={<ShopList />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
