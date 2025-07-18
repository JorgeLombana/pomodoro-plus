import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(`./features/dashboard/dashboard`).then((c) => c.Dashboard),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
