export default class Unit {
    template = `
        <div id="title" class="title is-2"></div>
        <div id="loadersWrapper" class="field is-grouped"></div>
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
            this.init();
        });
    }
    
    init() {
        this.app.request('load', {fileName: this.fileName})
            .then(responce => {
                this.data = responce;
                if(this.data.date) {
                    this.printer.update(this.data);
                    for (let loader of this.loaders) {
                        loader.updateDate(this.data.date);
                    }                    
                    this.printer.show();
                }
            });
    }

    render() {
        this.view.querySelector('#title').innerText = this.title;
        for (let loader of this.loaders) {
            this.view.querySelector('#loadersWrapper').appendChild(loader.view);
        };        
        this.view.querySelector('#printerWrapper').appendChild(this.printer.view);
    }

    constructor(app, params) {
        this.app = app;

        this.title = params['title'];
        this.fileName = params['filename'];
        this.labelName = params['labelName'];

        this.loaders = [];

        if (params['loaders']) {
            for (let loader of params['loaders']) {
                loader.injection('app', this.app);
                loader.injection('unit', this);
                this.loaders.push(loader);                
            };
        };

        if (params['printer']) {
            this.printer = params['printer'];
            this.printer.injection('app', this.app);
            this.printer.injection('unit', this);
        };

        this.view = document.createElement('div');
        this.view.innerHTML = this.template;

        this.createTab();
        this.render();        
    }
}