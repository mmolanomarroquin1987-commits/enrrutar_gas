'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Map, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore, RouteRecord } from '@/store/useDataStore';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { LocationMap } from '@/components/shared/LocationMap';

const formSchema = z.object({
  date: z.date({
    required_error: 'La fecha es obligatoria.',
  }).max(new Date(), { message: 'La fecha no puede ser futura.' }),
  id: z.string().min(1, 'Obligatorio').regex(/^[a-zA-Z0-9]+$/, 'Solo números y letras'),
  correctRoute: z.string().min(1, 'Obligatorio'),
  meter: z.string().min(6, 'Mínimo 6 dígitos').regex(/^\d+$/, 'Solo números'),
  cycle: z.enum(['C1', 'C2', 'C3', 'C4'], { required_error: 'Selecciona un ciclo' }),
  neighborhoodCode: z.string().length(5, 'Debe tener exactamente 5 caracteres'),
  observations: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export default function EnrutamientoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addRoute } = useDataStore();
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      correctRoute: '',
      meter: '',
      neighborhoodCode: '',
      observations: '',
    },
  });

  const watchObservations = form.watch('observations');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!photoBase64) {
      toast.error('Debes tomar una foto del medidor');
      return;
    }
    if (!coordinates) {
      toast.error('Debes capturar las coordenadas GPS');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newRoute: RouteRecord = {
      ...values,
      date: values.date.toISOString(),
      observations: values.observations || '',
      uniqueId: Math.random().toString(36).substr(2, 9),
      photoBase64,
      coordinates,
      syncedAt: new Date().toISOString(),
    };

    addRoute(newRoute);
    toast.success('Datos sincronizados correctamente');
    
    // Reset form
    form.reset();
    setPhotoBase64(null);
    setCoordinates(null);
    setIsSubmitting(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="h-8 w-8 text-primary" />
            Enrutamiento
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Captura los datos del medidor, la foto de evidencia y sincroniza.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-12",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Registro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. A123" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="correctRoute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruta Correcta</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Seleccionar ruta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Norte-01">Norte-01</SelectItem>
                          <SelectItem value="Norte-02">Norte-02</SelectItem>
                          <SelectItem value="Sur-01">Sur-01</SelectItem>
                          <SelectItem value="Centro-01">Centro-01</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciclo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Seleccionar ciclo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="C1">C1</SelectItem>
                          <SelectItem value="C2">C2</SelectItem>
                          <SelectItem value="C3">C3</SelectItem>
                          <SelectItem value="C4">C4</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="meter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Medidor</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Mínimo 6 dígitos" className="h-12 text-lg font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhoodCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barrio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. B0001" className="h-12 text-lg uppercase" maxLength={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    Evidencia Fotográfica
                  </h3>
                  <CameraCapture onCapture={setPhotoBase64} buttonLabel={photoBase64 ? "Foto Tomada ✓" : "Tomar Foto del Medidor"} />
                  {photoBase64 && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Info className="h-4 w-4" /> Foto guardada en memoria
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    Geolocalización
                  </h3>
                  <LocationMap onLocationChange={(lat, lng) => setCoordinates({ lat, lng })} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Anotaciones relevantes sobre el medidor o la lectura..." 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <div className="text-xs text-right text-slate-500">
                        {watchObservations?.length || 0} / 500 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-lg mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  'Sincronizar Datos'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
