export default class Loader {

    data = [];

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('mr-4');

        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = 'Загрузка разнарядки';
        
        this.input = document.createElement('input');
        this.input.classList.add('button');
        this.input.type = 'file';

        this.lastDate = document.createElement('div');
        this.lastDate.classList.add('is-size-7', 'has-text-weight-bold');
        this.lastDate.innerHTML = `Данные загружены: <span class="has-text-success">${this.date}</span>`;

        this.input.addEventListener('change', this.handleFile.bind(this), false);

        this.notification = document.createElement('div');
        this.notification.classList.add('notification', 'is-primary', 'is-light', 'is-hidden');
        this.notification.innerText = 'Данные загружены';

        this.view.appendChild(label);
        this.view.appendChild(this.input);
        this.view.appendChild(this.lastDate);
        this.view.appendChild(this.notification);
    }

    save() {
        let savingData = {
            fileName: this.unit.fileName,
            labelName: this.unit.labelName,
            data: this.data
        };
        this.app.request('save', savingData)
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                this.unit.init();
                setTimeout(()=> {
                    this.notification.classList.add('is-hidden');
                    this.input.value = '';
                },500);        
            };
        });
    }

    updateDate(date) {
        this.date = date;
        this.lastDate.innerHTML = `Данные загружены: <span class="has-text-success">${this.date}</span>`;
    }
    
    injection(key, obj) {
        this[key] = obj;
      }

    constructor() {
        this.date = 'никогда';
        this.render();
    }    
}