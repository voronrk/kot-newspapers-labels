export default class AifKirovKomi {

    // separatedData = [];
    // labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'aifkirovkomi', 'customer': 'АиФ-Киров (Коми)', 'labelName': 'Аргументы и факты, АО'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    parse(inputData) {
        let begin = false;
        let parsedData = {title: 'Аргументы и факты', data: []};

        let inputDataArray = inputData.split('\r\n');
                
        for(let item of inputDataArray) {
            let itemArray = item.replace(/(\d+),(\d+)/g,'$1$2').split(';');
            if (begin) {
                parsedData.data.push({title: itemArray[0], value: parseInt(itemArray[3]) + parseInt(itemArray[4])});
            }
            if (itemArray[0].search('---') === 0) {
                begin = !begin;
            }
        }
        parsedData.data.pop();
        console.log(parsedData);
        this.request('save', [parsedData])
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
    }
    
    handleFile(e) {
        this.labelData = [];
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
            let data = e.target.result.replaceAll(/( ){3,}/g,';');
            this.parse(data);
        });
        reader.readAsText(file, 'CP1251');
    };

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('mr-4');

        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = 'АиФ-Киров (Коми)';
        
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
        this.tab.innerHTML = `<a>АиФ-Киров (Коми)</a>`;
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