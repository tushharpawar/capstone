"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useState } from 'react';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore More' },
    { href: '/report', label: 'Register Report' },
    { href: '/password-check', label: 'Check Password' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/news', label: 'News' },
  ];
  

  // Find the index of the active tab (not used)

  // Height of navbar (p-5 = 1.25rem top/bottom, so ~80px total)
  const NAVBAR_HEIGHT = 80;

  // Add a spacer div after navbar to push content down
  return (
    <>
      <nav className="w-full p-5 flex justify-between items-center bg-gray-900 shadow-md fixed top-0 left-0 z-50 transition-all duration-300 backdrop-blur-md bg-gray-900/95">
      <div className="text-lg font-semibold text-white">Capstone</div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className={`block h-0.5 w-6 bg-white mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-white mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Links */}
      <div className="hidden md:flex gap-5 items-center relative">
        {navLinks.map((link) => (
          <div key={link.href} className="relative flex flex-col items-center">
            <Link
              href={link.href}
              className={`text-lg px-1 text-white transition-colors duration-200 ${pathname === link.href ? 'font-bold' : 'font-normal'}`}
              style={{ zIndex: 1 }}
            >
              {link.label}
            </Link>
            {/* Animated underline for active tab */}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 rounded bg-blue-400 transition-all duration-300 ${pathname === link.href ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
              style={{ transitionProperty: 'width, opacity' }}
            />
          </div>
        ))}
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 shadow-lg flex flex-col gap-4 p-5 md:hidden animate-fade-in z-30">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg text-white flex flex-col items-start ${pathname === link.href ? 'font-bold underline underline-offset-4 decoration-blue-400' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </div>
      )}
      </nav>
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />
    </>
  );
}

export default Navbar;