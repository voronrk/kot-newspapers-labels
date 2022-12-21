export default class Print {

    template = `
        <div class="title is-size-5">Печать ярлыков</div>

        <div class="field">
            <label class="label">Заказчик</label>
            <div class="select">
                <select id="select-customer" ></select>
            </div>
        </div>

        <form class="form mt-4" id="label-form">
            <div class="field is-grouped">
                <div class="field">
                    <label class="label">Издание</label>
                    <div class="select">
                        <select id="select-title" name="title"></select>
                    </div>
                    <p class="help is-danger is-hidden" id="title-warning">Заполните поле</p>
                </div>
                <div class="field ml-4">
                    <label class="label">Номер</label>
                    <input name="num" class="input" type="text" placeholder="Номер">
                    <p class="help is-danger is-hidden" id="num-warning">Заполните поле</p>
                </div>
                <div class="field ml-4">
                    <label class="label">Дата выхода</label>
                    <input name="date" class="input" type="date" placeholder="Дата">
                    <p class="help is-danger is-hidden" id="date-warning">Заполните поле</p>
                </div>
                <div class="field ml-4">
                    <label class="label">Тираж</label>
                    <input name="count" class="input" type="number" placeholder="Тираж">
                    <p class="help is-danger is-hidden" id="count-warning">Заполните поле</p>
                </div>
                <div class="field ml-4">
                    <label class="label">Номер заказа</label>
                    <input name="ordernum" class="input" type="string" placeholder="Номер заказа">
                    <p class="help is-danger is-hidden" id="ordernum-warning">Заполните поле</p>
                </div>
            </div>
            <div class="field is-grouped">
                <div class="field ml-4">
                    <label class="label">Формат</label>
                    <div class="control">
                        <label class="radio">
                            <input type="radio" name="size" value="A4">
                            А4
                        </label>
                        <label class="radio">
                            <input type="radio" name="size" value="A6">
                            А6
                        </label>
                    </div>
                    <p class="help is-danger is-hidden" id="size-warning">Заполните поле</p>
                </div>
                <div class="field ml-4">
                    <label class="label">Количество в пачке</label>
                    <input name="countpack" class="input" type="number" placeholder="В пачке" value="200" step=50>
                    <p class="help is-danger is-hidden" id="count-pack-warning">Заполните поле</p>
                </div>
            </div>
            <button type="submit" class="button is-primary" id="button-print">Печатать</button>        
        </form>
     `;

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'village'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
      }
      
    validate(form) {
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
      if(form.countpack.value == '' || form.countpack.value == 0) {
        document.querySelector('#count-pack-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.size.value == '') {
        document.querySelector('#size-warning').classList.remove('is-hidden');
        flag = false;
      };
      return flag;
    }
    
    formatDate(date) {
      let arDate = date.split('-');
      return `${arDate[2]}.${arDate[1]}.${arDate[0]}`
    }
    
    renderTitleSelect(data) {
      selectTitle.innerHTML = `<option></option>`;
      for(let key in data) {
        selectTitle.innerHTML += `
        <option value=${key}>${data[key].title}</option>
        `;
      }
    }
    
    renderCustomerSelect(data) {
      selectCustomer.innerHTML = `<option></option>`;
      for(let key in data) {
        selectCustomer.innerHTML += `
        <option value=${key}>${data[key].customer}</option>
        `;
      };
      selectCustomer.addEventListener('change', () => {
        if(!(selectCustomer.value === '')) {
          labelData = data[selectCustomer.value].data;
          labelName = data[selectCustomer.value].labelName;
          renderTitleSelect(labelData);      
        }
      });
    }

    constructor(customer) {
      this.view = document.createElement('div');
      this.view.innerHTML = this.template;
    }

}