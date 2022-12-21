export default class Unit {
    template = `
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

    constructor(app, params) {
        this.app = app;
        this.view = document.createElement('div');
        this.view.innerHTML = this.template;

        this.title = params['title'];
        this.filename = `${params['filename']}.json`;
        this.labelName = params['labelName'];

        if (params['loader']) {
            this.loader = params['loader'];
        };

        if (params['printer']) {
            this.printer = params['printer'];
        };

        this.createTab();

        this.view.querySelector('#loaderWrapper').appendChild(this.loader.view);
        this.view.querySelector('#printerWrapper').appendChild(this.printer.view);
    }
}