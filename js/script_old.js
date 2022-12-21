import ParseVID from './load/LoadVID.js';
import ParseAifKirov from './load/LoadAifKirov.js';
import ParseAifKirovKomi from './load/LoadAifKirovKomi.js';
import ParseRG from './load/LoadRG.js';
import Labels from './print/Labels.js';
import Print from './print/Print.js';
import App from './App.js';

const appWrapper = document.querySelector('#app');

let labelData = [];
let labelName = '';

async function request(method, data=[]) {
  const params={'method': method, 'data': data, 'name': 'village'};
  const response = await fetch ('back.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(params)
  });
  return await response.json();
}

function validate(form) {
  let flag = true;
  for(let warning of warnings) {
    warning.classList.add('is-hidden');
  }
  if(form.title.value == '') {
    document.querySelector('#title-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.num.value == '') {
    document.querySelector('#num-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.ordernum.value == '') {
    document.querySelector('#ordernum-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.date.value == '') {
    document.querySelector('#date-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.count.value == '') {
    document.querySelector('#count-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.countpack.value == '' || form.countpack.value == 0) {
    document.querySelector('#count-pack-warning').classList.remove('is-hidden');
    flag = false;
  };
  if(form.size.value == '') {
    document.querySelector('#size-warning').classList.remove('is-hidden');
    flag = false;
  };
  return flag;
}

function formatDate(date) {
  let arDate = date.split('-');
  return `${arDate[2]}.${arDate[1]}.${arDate[0]}`
}

function renderTitleSelect(data) {
  selectTitle.innerHTML = `<option></option>`;
  for(let key in data) {
    selectTitle.innerHTML += `
    <option value=${key}>${data[key].title}</option>
    `;
  }
}

function renderCustomerSelect(data) {
  selectCustomer.innerHTML = `<option></option>`;
  for(let key in data) {
    selectCustomer.innerHTML += `
    <option value=${key}>${data[key].customer}</option>
    `;
  };
  selectCustomer.addEventListener('change', () => {
    if(!(selectCustomer.value === '')) {
      labelData = data[selectCustomer.value].data;
      labelName = data[selectCustomer.value].labelName;
      renderTitleSelect(labelData);      
    }
  });
}

function renderLoaders(data) {
  const dateVID = data.filter(item => {return item.customer == 'Вятский издательский дом'}).length > 0 ? data.filter(item => {return item.customer == 'Вятский издательский дом'})[0]['date'] : '';
  const dateAifKirov = data.filter(item => {return item.customer == 'АиФ-Киров'}).length > 0 ? data.filter(item => {return item.customer == 'АиФ-Киров'})[0]['date'] : '';
  const dateAifKomi = data.filter(item => {return item.customer == 'АиФ-Киров (Коми)'}).length > 0 ? data.filter(item => {return item.customer == 'АиФ-Киров (Коми)'})[0]['date'] : '';
  const dateRG = data.filter(item => {return item.customer == 'РГ'}).length > 0 ? data.filter(item => {return item.customer == 'РГ'})[0]['date'] : '';
  const parseVID = new ParseVID(dateVID);
  const parseAifKirov = new ParseAifKirov(dateAifKirov);
  const parseAifKirovKomi = new ParseAifKirovKomi(dateAifKomi);
  const parseRG = new ParseRG(dateRG);
  tabs.appendChild(parseVID.tab);
  tabs.appendChild(parseAifKirov.tab);
  tabs.appendChild(parseAifKirovKomi.tab);
  tabs.appendChild(parseRG.tab);
}

let app = new App();
appWrapper.appendChild(app.view);

// let print = new Print();

// document.querySelector('#print').innerHTML = print.view;

const btnPrint = document.querySelector('#button-print');
const selectTitle = document.querySelector('#select-title');
const selectCustomer = document.querySelector('#select-customer');
const labelForm = document.querySelector('#label-form');
const warnings = document.querySelectorAll('.is-danger');
const load = document.querySelector('#load');
const tabs = document.querySelector('#tabs');

request('load')
  .then(responce => {
    console.log(responce);
    let data = responce;
    renderLoaders(data);
    if (data.length > 0) {
      document.querySelector('#labels-wrapper').classList.remove('is-hidden');
      renderCustomerSelect(data);
      btnPrint.addEventListener('click', (e) => {
        e.preventDefault();
        if (validate(labelForm.elements)) {
          console.log(labelData);
          let params = {
            title: labelData[labelForm.elements.title.value].title,
            labelName: labelName,
            num: labelForm.elements.num.value,
            orderNum: labelForm.elements.ordernum.value,
            date: formatDate(labelForm.elements.date.value),
            totalCount: labelForm.elements.count.value,
            maxItemsInPack: labelForm.elements.countpack.value,
            size: labelForm.elements.size.value,
            data: labelData[labelForm.elements.title.value].data
          };
          let label = new Labels(params, labelForm);
        }        
      });
    };
})

