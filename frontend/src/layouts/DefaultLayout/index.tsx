import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export function DefaultLayout() {
  return (
    <>
      <div className="h-full w-full">
        <Navbar />

        <main>
          <div className="">
            <div className="mx-4 px-4 py-2">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
