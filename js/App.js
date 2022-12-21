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

    constructor() {
        this.view = document.createElement('div');
        this.view.classList.add('box');
        this.view.innerHTML = this.template;

        this.tabs = this.view.querySelector('#tabs');
        this.mainWrapper = this.view.querySelector('#mainWrapper');
    }
}