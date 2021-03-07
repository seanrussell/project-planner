import 'common/css/materialicons.css';
import 'common/css/materialize.min.css';
import 'common/css/kanban.css';
import './sass/styles.scss';
import 'common/js/materialize.min.js';

import { parseRequestUrl, showLoading, hideLoading } from './utils';

import Error404Screen from './screens/Error404Screen';
import Navigation from './components/Navigation';
import LandingScreen from './screens/LandingScreen';
import ProjectListScreen from './screens/ProjectListScreen';
import ProjectScreen from './screens/ProjectScreen';
import BacklogListScreen from './screens/BacklogListScreen';
import BacklogScreen from './screens/BacklogScreen';
import SprintListScreen from './screens/SprintListScreen';
import SprintScreen from './screens/SprintScreen';
import BoardListScreen from './screens/BoardListScreen';
import BoardScreen from './screens/BoardScreen';

const routes = {
  '/': LandingScreen,
  '/projects': ProjectListScreen,
  '/projects/:id': ProjectScreen,
  '/backlogs': BacklogListScreen,
  '/backlogs/:id': BacklogScreen,
  '/sprints': SprintListScreen,
  '/sprints/:id': SprintScreen,
  '/boards': BoardListScreen,
  '/boards/:id': BoardScreen,
};

const router = async () => {
    showLoading();

    const request = parseRequestUrl();

    const parseUrl =
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? '/:id' : '') +
        (request.verb ? `/${request.verb}` : '');

    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    
    const navigation = document.getElementById('navigation');
    navigation.innerHTML = await Navigation.render();
    
    const main = document.getElementById('app');
    main.innerHTML = await screen.render();

    if (screen.after_render) {
        await screen.after_render();
    }

    hideLoading();
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
