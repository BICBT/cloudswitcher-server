import { Route } from './common/http';
import { switcherController } from './controller/switchercontroller';
import { sourceController } from './controller/sourcecontroller';
import { audioController } from './controller/audiocontroller';

const version = '/v1';

export const routes: Route[] = [
  {
    method: 'get',
    route: `${version}/output`,
    action: switcherController.getOutput.bind(switcherController),
  },
  {
    method: 'get',
    route: `${version}/scenes`,
    action: switcherController.getScenes.bind(switcherController),
  },
  {
    method: 'post',
    route: `${version}/switch/:sceneId`,
    action: switcherController.switch.bind(switcherController),
  },
  {
    method: 'post',
    route: `${version}/restart`,
    action: switcherController.restart.bind(switcherController),
  },
  {
    method: 'get',
    route: `${version}/audio`,
    action: audioController.get.bind(audioController),
  },
  {
    method: 'patch',
    route: `${version}/audio`,
    action: audioController.update.bind(audioController),
  },
  {
    method: 'get',
    route: `${version}/scenes/:sceneId/sources/:sourceId`,
    action: sourceController.get.bind(sourceController),
  },
  {
    method: 'patch',
    route: `${version}/scenes/:sceneId/sources/:sourceId`,
    action: sourceController.update.bind(sourceController),
  },
];
