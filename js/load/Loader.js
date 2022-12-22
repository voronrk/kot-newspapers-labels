export default class Loader {

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'VID', 'customer': 'Вятский издательский дом', labelName: 'Вятский издательский дом, КОГАУ'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('mr-4');

        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = 'Загрузка разнарядки';
        
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
    }

    init() {

    }    

    constructor() {
        this.render();
    }
    
}