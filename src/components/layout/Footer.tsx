import Link from 'next/link';
import { Activity, Mail, Phone, MapPin, Globe, MessageCircle, Share2, Hash, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-white">
                MOBATOS
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Sistema inteligente de gestión y enrutamiento de medidores. Optimizando el trabajo de campo con tecnología de punta.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Share2 className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Hash className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/enrutamiento" className="text-sm hover:text-primary transition-colors">Enrutamiento</Link></li>
              <li><Link href="/usuarios" className="text-sm hover:text-primary transition-colors">Usuarios</Link></li>
              <li><Link href="/tablas" className="text-sm hover:text-primary transition-colors">Tablas de Datos</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">Edificio Central, Oficina 402<br/>Bogotá, Colombia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">+57 (601) 555-0192</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm">contacto@mobatos.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Horario de Atención</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm space-y-1">
                  <p><span className="font-medium text-white">Lunes - Viernes:</span><br/> 8:00 AM - 6:00 PM</p>
                  <p><span className="font-medium text-white">Sábados:</span><br/> 8:00 AM - 1:00 PM</p>
                  <p><span className="font-medium text-white">Domingos y Festivos:</span><br/> Cerrado</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Mobatos. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
