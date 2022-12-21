import LoadVID from './load/LoadVID.js';
import LoadAifKirov from './load/LoadAifKirov.js';
import LoadAifKirovKomi from './load/LoadAifKirovKomi.js';
import LoadRG from './load/LoadRG.js';
import Labels from './print/Labels.js';
import Print from './print/Print.js';
import App from './App.js';
import Unit from './Unit.js';

const unitParams = [
  {
    title: 'Районки',
    filename: 'VID',
    labelName: 'Вятский издательский дом, КОГАУ',
    loader: new LoadVID(),
    printer: new Print(),
  },
  {
    title: 'АиФ-Киров',
    filename: 'aifkirov',
    labelName: 'Аргументы и факты, АО',
    loader: new LoadAifKirov(),
    printer: new Print(),
  },
  {
    title: 'АиФ-Киров (Коми)',
    filename: 'aifkirovkomi',
    labelName: 'Аргументы и факты, АО',
    loader: new LoadAifKirovKomi(),
    printer: new Print(),
  },
  {
    title: 'РГ',
    filename: 'aifkirovkomi',
    labelName: 'АО "Издательство "Российская газета"',
    loader: new LoadRG(),
    printer: new Print(),
  },
];

const appWrapper = document.querySelector('#app');

let app = new App();
appWrapper.appendChild(app.view);

for(let unit of unitParams) {
  app.addUnit(new Unit(app, unit));
}

