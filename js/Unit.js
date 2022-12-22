export default class Unit {
    template = `
        <div id="title" class="title is-2"></div>
        <div id="loaderWrapper" class="field is-grouped"></div>
        <div id="printerWrapper" class="mt-4"></div>        
    `;

    createTab() {
        this.tab = document.createElement('li');
        this.tab.innerHTML = `<a>${this.title}</a>`;
        this.tab.addEventListener('click', () => {
            for(let tab of document.querySelector('#tabs').querySelectorAll('li')) {
                tab.classList.remove('is-active');
            };
            this.tab.classList.add('is-active');
            this.app.mainWrapper.innerHTML = '';
            this.app.mainWrapper.appendChild(this.view);
        });
    }
    
    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': this.fileName, 'customer': this.title, labelName: this.labelName};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    init() {
        this.request('load')
            .then(responce => {
                this.data = responce;
                this.printer.update(this.data);
            })
    }

    constructor(app, params) {
        this.app = app;

        this.title = params['title'];
        this.fileName = params['filename'];
        this.labelName = params['labelName'];

        if (params['loader']) {
            this.loader = params['loader'];
        };

        if (params['printer']) {
            this.printer = params['printer'];
        };

        this.init();

        this.view = document.createElement('div');
        this.view.innerHTML = this.template;

        this.createTab();

        this.view.querySelector('#title').innerText = this.title;
        this.view.querySelector('#loaderWrapper').appendChild(this.loader.view);
        this.view.querySelector('#printerWrapper').appendChild(this.printer.view);
    }
}