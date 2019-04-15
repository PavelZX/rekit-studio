import _ from 'lodash';
import plugin from './plugin';
import App from '../features/home/App';
import { PageNotFound } from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';
import rekitCmdsRoute from '../features/rekit-cmds/route';
import diagramRoute from '../features/diagram/route';
import rekitToolsRoute from '../features/rekit-tools/route';
import configRoute from '../features/config/route';
import layoutRoute from '../features/layout/route';
import editorRoute from '../features/editor/route';
import coreRoute from '../features/core/route';
import tasksRoute from '../features/tasks/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for Rekit cmds to register routes for new features, remove features, etc.
const childRoutes = [
  homeRoute,
  commonRoute,
  rekitCmdsRoute,
  diagramRoute,
  rekitToolsRoute,
  configRoute,
  layoutRoute,
  editorRoute,
  coreRoute,
  tasksRoute,
];

function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  const indexRoute = route.childRoutes.find(child => child.isIndex);
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = route.path;
    first.exact = true;
    first.autoIndexRoute = true; // mark it so that the simple nav won't show it.
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

export default () => {
  plugin.getPlugins('route').forEach(p => {
    childRoutes.push(..._.castArray(p.route));
  });

  const routes = [
    {
      path: '/',
      component: App,
      childRoutes: [
        ...childRoutes,
        { path: '*', name: 'Page not found', component: PageNotFound },
      ].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0)),
    },
  ];

  routes.forEach(handleIndexRoute);
  return routes;
};
