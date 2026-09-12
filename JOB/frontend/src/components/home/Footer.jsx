import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/job" },
  { label: "Browse", to: "/browse" },
  { label: "Companies", to: "/companies" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr] xl:items-start">
          <div className="flex flex-col items-start">
            <Link
              to="/"
              className="inline-block text-2xl font-black tracking-tight text-white"
            >
              Job<span className="text-red-400">Portal</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Discover the best careers, connect with top employers, and build a
              future that matches your ambition.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-blue-400"
                  aria-label={social.label}
                >
                  {social.label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-lg font-bold text-white">
              For Candidates
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/job" className="transition hover:text-blue-400">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse" className="transition hover:text-blue-400">
                  Explore Categories
                </Link>
              </li>
              <li>
                <Link to="/signup" className="transition hover:text-blue-400">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-blue-400">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="mb-5 text-lg font-bold text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>hello@jobportal.com</li>
              <li>+91 98765 43210</li>
              <li>123 Career Street, India</li>
              <li>Mon - Sat, 9:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
