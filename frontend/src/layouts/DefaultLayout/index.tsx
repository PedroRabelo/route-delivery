import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export function DefaultLayout() {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />

      <div className="flex flex-1 flex-col px-4 py-2 max-h-full">
        <Outlet />
      </div>
    </div>
  )
}
