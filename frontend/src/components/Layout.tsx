import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;