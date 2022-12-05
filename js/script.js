'use strict';

const btnPrint = document.querySelector('#button-print');
const fileField = document.querySelector('#input-file');
const selectTitle = document.querySelector('#select-title');
const labelForm = document.querySelector('#label-form');
const warnings = document.querySelectorAll('.is-danger');

fileField.value = '';
let separatedData = [];
let labelData = [];
let filename = '';

async function request(method, data=[]) {
  const params={'method': method, 'data': data};
  const response = await fetch ('back.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(params)
  });
  return await response.json();
}

function getFileName_DEPRECATED(refString) {
  switch (refString){
    case 'январь':
      return 'january';
    break;
    case 'февраль':
      return 'february';
    break;
    case 'март':
      return 'march';
    break;
    case 'апрель':
      return 'april';
    break;
    case 'май':
      return 'may';
    break;
    case 'июнь':
      return 'june';
    break;
    case 'июль':
      return 'july';
    break;
    case 'август':
      return 'august';
    break;
    case 'сентябрь':
      return 'september';
    break;
    case 'октябрь':
      return 'october';
    break;
    case 'ноябрь':
      return 'november';
    break;
    case 'декабрь':
      return 'december';
    break;
  }  
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
      // console.log(workbook);
      // console.log(workbook.Sheets['Лист1']);
      parse(workbook.Sheets['Лист1']);
    /* DO SOMETHING WITH workbook HERE */
  };
  reader.readAsArrayBuffer(f);
};

function renderLabel(params, title, quantity) {
  let view = `
  <table class="table is-bordered has-text-centered">
  <tr>
      <td rowspan="6" class="py-6 is-vcentered"><img src="img/pic.png"></td>
      <td class="has-text-weight-bold is-size-3">Не бросать!</td>
      <td rowspan="6" class="is-vcentered p-0"><div class="has-text-weight-bold is-size-2 zakaz">Заказ ${params.orderNum}</div></td>
  </tr>
  <tr><td class="np-title is-size-3">Вятский издательский дом, КОГАУ</td></tr>
  <tr><td class="has-text-weight-bold is-size-1 p-0 np-title"><span>${params.title}</span><br> № ${params.num} от ${params.date}<br><br>${title}</td></tr>
  <tr><td class="has-text-right np-title is-size-3">В пачке <span class="is-size-2 has-text-weight-bold">${quantity}</span> экз.</td></tr>
  <tr><td class="is-size-4">ООО "Элефант"<br>
  Россия, 610004, г. Киров, ул. Ленина, 2Б</td></tr>
  <tr><td class="has-text-weight-bold is-size-4">2022</td></tr>        
</table>
`;
return view;
}

function printLabels(params) {
  const viewPrint = document.createElement('div');
  for(let item of params.data) {
    console.log(item.labels200Count)
    let i=0;
    while(i<item.labels200Count) {
      viewPrint.innerHTML += renderLabel(params, item.title, 200);
    i++;
    }
    viewPrint.innerHTML += renderLabel(params, item.title, item.labelTail);
  };

  const WinPrint = window.open('','','left=50,top=50,width=1920,height=1080,toolbar=0,scrollbars=1,status=0');
    WinPrint.document.write(`<link rel="stylesheet" href="../css/bulma.min.css">`);
    WinPrint.document.write(`<link rel="stylesheet" href="../css/printstyle.css">`);
    WinPrint.document.write(viewPrint.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(()=> {
      WinPrint.print();
      // WinPrint.close();
      // labelForm.reset();
    },500);
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

function calculateEditorialPart(data, totalCount) {
  let sum = 0;
  for(let item of data) {
    sum += +item.value;
  };
  return totalCount - sum;
}

function generateLabels(params) {
  params.data.push({title:'Редакция', value: calculateEditorialPart(params.data, params.totalCount)})
  for(let item of params.data) {
    item['labels200Count'] = Math.floor(item.value/200);
    item['labelTail'] = item.value%200;
  }
  console.log(params);
  printLabels(params);
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
  return flag;
}

fileField.addEventListener('change', handleFile, false);

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
            data: labelData[labelForm.elements.title.value].data
          };
          generateLabels(params);
        }        
      });
    };
})

