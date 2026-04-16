'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs' },
  { href: '/projects', label: 'Projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/news', label: 'News' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-secondary/10 border-b border-border py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-4 items-center">
            <a href="tel:+211929328421" className="text-foreground hover:text-primary transition-colors font-medium">
              📞 +211 929 328 421
            </a>
            <a href="mailto:info@liss-southsudan.org" className="text-foreground hover:text-primary transition-colors font-medium">
              ✉️ info@liss-southsudan.org
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/liss-logo.png"
                alt="LISS Logo"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12"
                priority
              />
              <div className="hidden sm:block">
                <div className="text-base sm:text-lg font-bold text-secondary">LISS</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Lifeline Initiative – South Sudan</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Button asChild variant="default" size="sm">
                <Link href="/admin">Dashboard</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-primary bg-green-50 border-l-4 border-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="px-4 py-3 border-t border-gray-200">
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-primary text-white text-center py-2 rounded-lg font-medium"
                >
                  Dashboard
                </Link>
              </div>
            )}
            <div className="px-4 py-3 border-t border-gray-200">
              <a
                href="tel:+211929328421"
                className="text-sm font-medium text-primary"
              >
                +211 929 328 421
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
