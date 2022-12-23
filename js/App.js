import Print from './print/Print.js';

export default class App {

    units = [];

    template = `
        <div class="tabs is-boxed">
            <ul id='tabs'></ul>
        </div>
        <div id="mainWrapper"></div>
    `;

    addUnit(unit) {
        this.units.push(unit);
        this.tabs.appendChild(unit.tab);
    }
    
    /**
     * 
     * @param {*} method 
     * @param {*} params 
     *  data - array of newspaper's data
     *  fileName - file name w/o extension ans path
     *  customer - customer (DEPRECATED)
     *  labelName - name of customer in the label
     * @returns 
     */
    async request(method, params=[]) {
        const body={'method': method, 'params': params};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        return await response.json();
    }

    constructor() {
        this.view = document.createElement('div');
        this.view.classList.add('box');
        this.view.innerHTML = this.template;

        this.tabs = this.view.querySelector('#tabs');
        this.mainWrapper = this.view.querySelector('#mainWrapper');
    }
}