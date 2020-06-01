import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('pages/Home.vue'),
    //children: [{ path: '', component: () => import('pages/Home.vue') }]
  },
  {
    path: '/games/:id',
    component: () => import('pages/GameDetail.vue')
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
