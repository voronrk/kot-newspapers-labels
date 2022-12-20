export default class ParseVillage {

    separatedData = [];
    labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'RG', 'customer': 'РГ', labelName: 'АО "Издательство "Российская газета"'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    parse(inputData) {
        let parsedData = {};
        for(let key in inputData) {
            if(key[0] != '!') {
                parsedData[key] = inputData[key]['w'].trim();
            }
        }
        let data = {title: 'Издание 32185 "Российская газета" Неделя', data: [], totalCount: 0};
        for(let key in parsedData) {
            if(key[0]=='A') {
                let tmp = {};
                tmp.title = parsedData[key];
                let valueKey = key.replace('A','B');
                tmp.value = parsedData[valueKey];
                data.totalCount += parseInt(tmp.value);
                data.data.push(tmp);
            }            
        }
        data.totalCount = data.totalCount/2;
        console.log(this.data);
        this.request('save', [data])
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
    }

    getFile(e) {
        console.log(e);
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        this.parse(workbook.Sheets['Лист1']);
    }
    
    handleFile(e) {
        this.labelData = [];
        let files = e.target.files, f = files[0];
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, {type: 'array'});
            this.parse(workbook.Sheets['Лист1']);
        });
        reader.readAsArrayBuffer(f);
    };

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('mr-4');

        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = 'РГ';
        
        const input = document.createElement('input');
        input.classList.add('button');
        input.type = 'file';

        const lastDate = document.createElement('div');
        lastDate.classList.add('is-size-7', 'has-text-weight-bold');
        lastDate.innerHTML = `Данные загружены: <span class="has-text-success">${this.date}</span>`;

        input.addEventListener('change', this.handleFile.bind(this), false);

        this.notification = document.createElement('div');
        this.notification.classList.add('notification', 'is-primary', 'is-light', 'is-hidden');
        this.notification.innerText = 'Данные загружены';

        this.view.appendChild(label);
        this.view.appendChild(input);
        this.view.appendChild(lastDate);
        this.view.appendChild(this.notification);
        
        this.tab = document.createElement('li');
        this.tab.innerHTML = `<a>РГ</a>`;
        this.tab.addEventListener('click', () => {
            load = document.querySelector('#load');
            for(let tab of document.querySelector('#tabs').querySelectorAll('li')) {
                tab.classList.remove('is-active');
            };
            this.tab.classList.add('is-active');
            load.innerHTML = '';
            load.appendChild(this.view);
        });
    }

    constructor(date = '') {
        this.date = date ? date : 'никогда';
        this.render();
    }
}