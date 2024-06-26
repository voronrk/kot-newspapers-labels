import LoadVID from './load/LoadVID.js';
import LoadAifKirov from './load/LoadAifKirov.js';
import LoadAifKirov5ka from './load/LoadAifKirov5ka.js';
import LoadRG from './load/LoadRG.js';
import LoadKirPravda from './load/LoadKirPravda.js';
import LoadGold from './load/LoadGold.js';
import Print from './print/Print.js';
import App from './App.js';
import Unit from './Unit.js';

const appWrapper = document.querySelector('#app');

const unitParams = [
  {
    title: 'Районки',
    filename: 'VID',
    labelName: 'Вятский издательский дом, КОГАУ',
    loaders: [new LoadVID()],
    printer: new Print(),
  },
  {
    title: 'АиФ-Киров',
    filename: 'aifkirov',
    labelName: 'Аргументы и факты, АО',
    loaders: [new LoadAifKirov(), new LoadAifKirov5ka('Пятёрочки')],
    printer: new Print(),
  },
  {
    title: 'АиФ-Киров (Коми)',
    filename: 'aifkirovkomi',
    labelName: 'Аргументы и факты, АО',
    loaders: [new LoadAifKirov()],
    printer: new Print(),
  },
  {
    title: 'Российская газета',
    filename: 'RG',
    labelName: 'АО "Издательство "Российская газета"',
    loaders: [new LoadRG()],
    printer: new Print(),
  },
  {
    title: 'Кировская правда',
    filename: 'KirPravda',
    labelName: 'Вятский издательский дом, КОГАУ',
    loaders: [new LoadKirPravda()],
    printer: new Print(),
  },
];

let app = new App();
appWrapper.appendChild(app.view);

for(let unit of unitParams) {
  app.addUnit(new Unit(app, unit));
}

