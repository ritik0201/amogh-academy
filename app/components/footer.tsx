import React from "react";
import { Phone, MapPin, GraduationCap, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50/50 border-t border-blue-100 text-slate-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tighter text-slate-900 leading-none">AMOGH</span>
                <span className="font-bold text-[10px] text-blue-600 tracking-[0.2em] uppercase leading-none mt-1">Academy</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
              Varanasi's premier institute for expert K-12 coaching and advanced computer education. We build careers, not just students.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h4 className="text-slate-900 font-black text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="/coaching" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Coaching Classes</a></li>
              <li><a href="/computer-edu" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Computer Education</a></li>
              <li><a href="/join-us" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Join Amogh Academy</a></li>
              <li><a href="/faculty" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Our Faculty</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-slate-900 font-black text-lg mb-6 tracking-wide">Reach Out To Us</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-600 mt-1">
                  1st Floor, La-paradise Building,<br/>
                  (Above Axis Bank) Panchkoshi Road,<br/>
                  Ashok Nagar, Sarang Talab, Varanasi
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-sky-100 p-3 rounded-2xl flex-shrink-0">
                  <Phone className="w-5 h-5 text-sky-600" />
                </div>
                <div className="text-sm font-medium text-slate-600 space-y-1">
                  <a href="tel:+919807737046" className="block hover:text-blue-600 transition-colors">+91-9807737046</a>
                  <a href="tel:+917460008625" className="block hover:text-blue-600 transition-colors">+91-7460008625</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-500">
          <p>&copy; {new Date().getFullYear()} Amogh Academy. Designed to revolutionize education.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Admissions Currently Open
          </p>
        </div>
      </div>
    </footer>
  );
}
