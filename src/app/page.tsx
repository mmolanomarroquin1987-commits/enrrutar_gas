'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Map, Users, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1473625247510-8ceb1760943f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 backdrop-blur-sm mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Plataforma 2.0 ya disponible</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Mobatos - Gestión Inteligente <br className="hidden md:block"/> de Medidores
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            La solución definitiva para el enrutamiento, captura de datos en campo y gestión de usuarios. Optimiza tus operaciones con georreferenciación y sincronización en tiempo real.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/enrutamiento">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                  Ir al Panel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                  Ingresar a la Plataforma
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20">
              Conocer más
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Map className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enrutamiento Preciso</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Captura coordenadas GPS exactas en cada lectura. Evita errores humanos y optimiza las rutas de los operarios.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Datos Confiables</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Validación en tiempo real y registro fotográfico. Evidencia visual inalterable para cada proceso de lectura.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestión de Usuarios</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Administración completa de clientes y medidores. Historial, observaciones y vinculación a rutas de forma sencilla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Acerca de Nosotros</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Más de 10 años de experiencia transformando la operación de empresas de servicios públicos mediante tecnología innovadora y procesos optimizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Nuestra Misión</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Proveer herramientas tecnológicas de vanguardia que simplifiquen, aseguren y optimicen la recolección de datos en campo, mejorando la eficiencia operativa y la transparencia para las empresas de servicios.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3">Nuestra Visión</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ser el referente número uno en Latinoamérica en soluciones de software para la gestión integral de infraestructuras de medición y atención a usuarios en terreno.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4">Valores Mobatos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Innovación Constante', 'Integridad y Transparencia', 'Calidad de Servicio', 'Sostenibilidad'].map((valor) => (
                    <div key={valor} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                  <div className="text-4xl font-bold text-white mb-2">+150K</div>
                  <div className="text-slate-200">Medidores gestionados mensualmente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
