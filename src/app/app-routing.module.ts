import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'citas',
    loadChildren: () => import('./citas/citas.module').then(m => m.CitasPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioPageModule)
  },
  {
    path: 'inventario',
    loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then(m => m.ProductosPageModule)
  },
  {
    path: 'materiales',
    loadChildren: () => import('./materiales/materiales.module').then(m => m.MaterialesPageModule)
  },
  {
    path: 'administracion',
    loadChildren: () => import('./administracion/administracion.module').then(m => m.AdministracionPageModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockPageModule)
  },
  {
    path: 'grupos',
    loadChildren: () => import('./grupos/grupos.module').then(m => m.GruposPageModule)
  },
  {
    path: 'informes',
    loadChildren: () => import('./informes/informes.module').then(m => m.InformesPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./servicios/servicios.module').then(m => m.ServiciosPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesPageModule)
  },
  {
    path: 'confirmar-cita',
    loadChildren: () => import('./confirmar-cita/confirmar-cita.module').then(m => m.ConfirmarCitaPageModule)
  },
  {
    path: 'gestionar-citas',
    loadChildren: () => import('./gestionar-citas/gestionar-citas.module').then(m => m.GestionarCitasPageModule)
  },
  {
    path: 'crear-ficha',
    loadChildren: () => import('./crear-ficha/crear-ficha.module').then(m => m.CrearFichaPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsPageModule)
  },
  {
    path: 'editar-grupo/:kodea',
    loadChildren: () => import('./editar-grupo/editar-grupo.module').then(m => m.EditarGrupoPageModule)
  },
  {
    path: 'langile',
    loadChildren: () => import('./langile/langile.module').then(m => m.LangilePageModule)
  },
  {
    path: 'citas-del-dia',
    loadChildren: () => import('./citas-del-dia/citas-del-dia.module').then(m => m.CitasDelDiaPageModule)
  },
  {
    path: 'historiala',
    loadChildren: () => import('./historiala/historiala.module').then(m => m.HistorialaPageModule)
  },  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'crear',
    loadChildren: () => import('./crear/crear.module').then( m => m.CrearPageModule)
  },
  {
    path: 'crear-productos',
    loadChildren: () => import('./crear-productos/crear-productos.module').then( m => m.CrearProductosPageModule)
  },
  {
    path: 'crearmaterial',
    loadChildren: () => import('./crearmaterial/crearmaterial.module').then( m => m.CrearmaterialPageModule)
  },
  {
    path: 'crear-servicio',
    loadChildren: () => import('./crear-servicio/crear-servicio.module').then( m => m.CrearServicioPageModule)
  },
  {
    path: 'material-maileguak',
    loadChildren: () => import('./material-maileguak/material-maileguak.module').then( m => m.MaterialMaileguakPageModule)
  },
  {
    path: 'produktu-mugimenduak',
    loadChildren: () => import('./produktu-mugimenduak/produktu-mugimenduak.module').then( m => m.ProduktuMugimenduakPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
