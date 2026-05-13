'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity, Lock, Mail, User as UserIcon, Phone, KeyRound } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, Role, User } from '@/store/useAuthStore';

// Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  role: z.enum(['Administrador', 'Auxiliar Técnico'], {
    required_error: 'Selecciona un rol',
  }),
});

const registerSchema = z.object({
  fullName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Debe ser un email válido' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  role: z.enum(['Administrador', 'Auxiliar Técnico', 'Supervisor', 'Lecturista'], {
    required_error: 'Selecciona un rol',
  }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  secretCode: z.string().optional(),
}).refine(data => {
  if (data.role === 'Administrador' && data.secretCode !== 'ADMIN2026') {
    return false;
  }
  return true;
}, {
  message: "Código secreto incorrecto para crear Administrador",
  path: ["secretCode"]
});

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Auxiliar Técnico',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      secretCode: '',
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    // Mock Validation
    if (
      (values.email === 'admin@mobatos.com' && values.password === 'admin123' && values.role === 'Administrador') ||
      (values.email === 'auxiliar@mobatos.com' && values.password === 'aux123' && values.role === 'Auxiliar Técnico')
    ) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: values.email === 'admin@mobatos.com' ? 'Administrador Principal' : 'Auxiliar de Campo',
        email: values.email,
        role: values.role,
      };
      
      login(user);
      toast.success('¡Bienvenido a Mobatos!');
      router.push('/enrutamiento');
    } else {
      toast.error('Credenciales incorrectas. Verifica tu email, contraseña y rol.');
    }
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    // Mock Registration
    toast.success(`Usuario ${values.fullName} registrado correctamente como ${values.role}`);
    setIsRegistering(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Activity className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            MOBATOS
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isRegistering ? 'Registro de nuevos roles' : 'Ingresa a tu cuenta para continuar'}
          </p>
        </div>

        <Card className="shadow-2xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader>
            <CardTitle>{isRegistering ? 'Nuevo Usuario' : 'Iniciar Sesión'}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? 'Completa los datos para el nuevo integrante.' 
                : 'Usa tus credenciales para acceder a la plataforma.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isRegistering ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol de ingreso</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Auxiliar Técnico">Auxiliar Técnico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email o Usuario</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="correo@ejemplo.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11 text-base font-semibold mt-6">
                    Ingresar
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Juan Pérez" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="juan@ejemplo.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="3001234567" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol a asignar</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Auxiliar Técnico">Auxiliar Técnico</SelectItem>
                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                            <SelectItem value="Lecturista">Lecturista</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {registerForm.watch('role') === 'Administrador' && (
                    <FormField
                      control={registerForm.control}
                      name="secretCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Secreto (Para crear Admin)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input type="password" placeholder="Código secreto" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña Temporal</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11 text-base font-semibold mt-6">
                    Registrar Usuario
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-primary hover:underline font-medium"
            >
              {isRegistering ? 'Volver al inicio de sesión' : 'Registrar nuevo rol (Solo Admin)'}
            </button>
            
            {!isRegistering && (
              <div className="mt-6 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg w-full">
                <p className="font-semibold mb-1">Credenciales de Demo:</p>
                <p>Admin: admin@mobatos.com / admin123</p>
                <p>Auxiliar: auxiliar@mobatos.com / aux123</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
