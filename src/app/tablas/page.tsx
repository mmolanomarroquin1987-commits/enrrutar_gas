'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { 
  Download, Search, Trash2, Edit, FileSpreadsheet, MapPin, Camera, 
  ArrowUpDown, ChevronLeft, ChevronRight, Send
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore, RouteRecord, UserRecord } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TablasPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { routes, users, deleteRoute, deleteUser } = useDataStore();

  const [activeTab, setActiveTab] = useState('rutas');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'route' | 'user' } | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Export states
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Reset pagination on tab/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Filtering Logic
  const filteredRoutes = useMemo(() => {
    return routes.filter(r => 
      Object.values(r).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [routes, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      Object.values(u).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  // Pagination Logic
  const currentData = activeTab === 'rutas' ? filteredRoutes : filteredUsers;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteClick = (id: string, type: 'route' | 'user') => {
    setItemToDelete({ id, type });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'route') deleteRoute(itemToDelete.id);
      if (itemToDelete.type === 'user') deleteUser(itemToDelete.id);
      toast.success('Registro eliminado correctamente');
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const exportToExcel = (action: 'download' | 'send') => {
    const ws = XLSX.utils.json_to_sheet(currentData.map((item: any) => {
      // Create a clean copy for export without large base64 strings
      const { photoBase64, coordinates, ...cleanItem } = item;
      return {
        ...cleanItem,
        lat: coordinates?.lat,
        lng: coordinates?.lng
      };
    }));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === 'rutas' ? 'Rutas' : 'Usuarios');
    
    if (action === 'download') {
      XLSX.writeFile(wb, `mobatos_${activeTab}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
      toast.success('Archivo descargado correctamente');
    } else {
      // Simulate sending to billing area
      setExportModalOpen(true);
      setTimeout(() => {
        setExportModalOpen(false);
        toast.success('Archivo enviado exitosamente al área de facturación');
      }, 2000);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              Base de Datos
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Gestiona, filtra y exporta la información recolectada en campo.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => exportToExcel('download')} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar
            </Button>
            <Button onClick={() => exportToExcel('send')} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar a Facturación
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <Tabs defaultValue="rutas" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <TabsList className="h-12 w-full sm:w-auto">
                <TabsTrigger value="rutas" className="px-6 py-2">Rutas Capturadas</TabsTrigger>
                <TabsTrigger value="usuarios" className="px-6 py-2">Usuarios Registrados</TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar en todos los campos..." 
                  className="pl-9 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>Fecha <ArrowUpDown className="inline h-3 w-3 ml-1"/></TableHead>
                    <TableHead>ID <ArrowUpDown className="inline h-3 w-3 ml-1"/></TableHead>
                    {activeTab === 'rutas' ? (
                      <>
                        <TableHead>Ruta</TableHead>
                        <TableHead>Ciclo</TableHead>
                        <TableHead>Barrio</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Municipio</TableHead>
                      </>
                    )}
                    <TableHead>Medidor</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Foto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                        No se encontraron registros.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item: any) => (
                      <TableRow key={item.uniqueId}>
                        <TableCell className="font-medium">
                          {format(new Date(item.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{item.id}</TableCell>
                        
                        {activeTab === 'rutas' ? (
                          <>
                            <TableCell>{item.correctRoute}</TableCell>
                            <TableCell>{item.cycle}</TableCell>
                            <TableCell>{item.neighborhoodCode}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="max-w-[150px] truncate">{item.fullName}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.municipality}</TableCell>
                          </>
                        )}
                        
                        <TableCell className="font-mono text-primary font-semibold">{item.meter}</TableCell>
                        
                        <TableCell>
                          <div className="flex items-center text-xs text-slate-500">
                            <MapPin className="h-3 w-3 mr-1 text-primary" />
                            {item.coordinates?.lat?.toFixed(4)}, {item.coordinates?.lng?.toFixed(4)}
                          </div>
                        </TableCell>

                        <TableCell>
                          {item.photoBase64 ? (
                            <button 
                              onClick={() => {
                                setSelectedImage(item.photoBase64);
                                setImageModalOpen(true);
                              }}
                              className="h-8 w-12 rounded bg-slate-100 overflow-hidden border border-slate-200"
                            >
                              <img src={item.photoBase64} alt="Evidencia" className="h-full w-full object-cover" />
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-500 hover:text-destructive"
                              onClick={() => handleDeleteClick(item.uniqueId, activeTab as 'route' | 'user')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-slate-500">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, currentData.length)} de {currentData.length} registros
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium px-2">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro de eliminar este registro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminarán los datos de forma permanente de tu dispositivo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Evidencia Fotográfica</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-center bg-black/5 rounded-lg overflow-hidden border">
            {selectedImage && <img src={selectedImage} alt="Evidencia completa" className="max-h-[60vh] object-contain" />}
          </div>
          <DialogFooter>
            <Button onClick={() => setImageModalOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sending Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
          <Send className="h-12 w-12 text-primary animate-pulse mb-4" />
          <h3 className="text-xl font-semibold mb-2">Enviando al Área de Facturación</h3>
          <p className="text-slate-500 text-center">
            Procesando registros y estableciendo conexión segura...
          </p>
        </DialogContent>
      </Dialog>

    </div>
  );
}
