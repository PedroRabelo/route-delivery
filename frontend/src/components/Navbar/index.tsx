import logoUrl from '../../assets/logo.svg';
import { Logo } from '../Logo/Logo';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  return (
    <div className='flex h-24 bg-[#6E7078] items-center px-8'>
      <Logo className='h-56 pt-20 w-auto' />
    </div>
  )
}
