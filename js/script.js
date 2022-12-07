import ParseVillage from './ParseVillage.js';
import Labels from './Labels.js';

const btnPrint = document.querySelector('#button-print');
// const fileField = document.querySelector('#input-file');
const selectTitle = document.querySelector('#select-title');
const labelForm = document.querySelector('#label-form');
const warnings = document.querySelectorAll('.is-danger');
const load = document.querySelector('#load');

// fileField.value = '';
// let separatedData = [];
let labelData = [];
// let filename = '';

async function request(method, data=[]) {
  const params={'method': method, 'data': data};
  const response = await fetch ('back.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(params)
  });
  return await response.json();
}

function decChar(c) {
  return String.fromCharCode(c.charCodeAt(0) - 1);
}

function getColumn(inputData, key, maxIndex, destinationData) {
  let valueChar = key[0];
  let titleChar = decChar(valueChar);
  let index = +key.substring(1);
  for(let i = index + 1; i<=maxIndex; i++) {
    if ((inputData[`${valueChar}${i}`]) && (inputData[`${titleChar}${i}`] != 'Итого:')) {
      destinationData.push({title: inputData[`${titleChar}${i}`], value: inputData[`${valueChar}${i}`]});
    };
  }
}

//exit point
function compileData(inputData) {
  for(let segment of inputData) {
    let tmp = {title: segment.title, data: []};
    let segmentData = segment.data;
    for(let key in segmentData) {
      if(segmentData[key] == 'Экз.') {
        getColumn(segmentData, key, segment.lastIndex, tmp.data);
      }
    };
    labelData.push(tmp);
  }
  request('save', labelData)
    .then(result => {
      if (result > 0) {
        document.querySelector('#data-loaded-notification').classList.remove('is-hidden');
        setTimeout(()=> {
          location.reload();
        },500);        
      };
    });
}

function separateData(inputData) {
  console.log(inputData);
  for(let key in inputData) {
    let index = +key.substring(1);
    let tmp = separatedData.filter((item) => {return (index > item.firstIndex && index < item.lastIndex)})[0];
    if(tmp) {
      tmp.data[key] = inputData[key];
    };    
  }
  compileData(separatedData);
}

function createSegments(inputData) {
  for (let key in inputData) {
    if (inputData[key].match(/П[0-9]+/)) {
      if(separatedData.length>0) {
        separatedData[separatedData.length-1].lastIndex = key.substring(1)-1;
      };
      separatedData.push({
        firstIndex: +key.substring(1),
        title: inputData[key].replace(/П[0-9]+/, '').trim(),
        data: {}
      });
    }
  }
  separatedData[separatedData.length-1].lastIndex = 1000;
  separateData(inputData);  
}

function parse(inputData) {
  let parsedData = {};
  for(let key in inputData) {
    if(key[0] != '!') {
        parsedData[key] = inputData[key]['w'].trim();
    }
  }
  createSegments(parsedData);
}

function handleFile(e) {
  labelData = [];
  var files = e.target.files, f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, {type: 'array'});
      parse(workbook.Sheets['Лист1']);
  };
  reader.readAsArrayBuffer(f);
};

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

function renderTitleSelect() {
  selectTitle.innerHTML = `<option></option>`;;
  
  for(let key in labelData) {
    selectTitle.innerHTML += `
    <option value=${key}>${labelData[key].title}</option>
    `;
  }
}

// fileField.addEventListener('change', handleFile, false);
const parseVillage = new ParseVillage();
load.appendChild(parseVillage.view);

request('load')
  .then(responce => {
    labelData = responce;
    if (labelData.length > 0) {
      document.querySelector('#labels-wrapper').classList.remove('is-hidden');
      renderTitleSelect();
      btnPrint.addEventListener('click', (e) => {
        e.preventDefault();
        if (validate(labelForm.elements)) {
          let params = {
            title: labelData[labelForm.elements.title.value].title,
            num: labelForm.elements.num.value,
            orderNum: labelForm.elements.ordernum.value,
            date: formatDate(labelForm.elements.date.value),
            totalCount: labelForm.elements.count.value,
            maxItemsInPack: labelForm.elements.countpack.value,
            size: labelForm.elements.size.value,
            data: labelData[labelForm.elements.title.value].data
          };
          let label = new Labels(params);
        }        
      });
    };
})

