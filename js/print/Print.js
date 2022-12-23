export default class Print {

    template = `
        <div class="is-hidden" id="main-wrapper">
        <div class="title is-size-5 mt-6">Печать ярлыков</div>

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
        </div>
     `;

    async requestRenderLabels() {
        const params={'data': this.printParams};
        const response = await fetch ('renderLabels.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }
          
    validate(form) {
      let flag = true;
      for(let warning of this.view.querySelectorAll('.is-danger')) {
        warning.classList.add('is-hidden');
      }
      if(form.title.value == '') {
        this.view.querySelector('#title-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.num.value == '') {
        this.view.querySelector('#num-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.ordernum.value == '') {
        this.view.querySelector('#ordernum-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.date.value == '') {
        this.view.querySelector('#date-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.count.value == '') {
        this.view.querySelector('#count-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.countpack.value == '' || form.countpack.value == 0) {
        this.view.querySelector('#count-pack-warning').classList.remove('is-hidden');
        flag = false;
      };
      if(form.size.value == '') {
        this.view.querySelector('#size-warning').classList.remove('is-hidden');
        flag = false;
      };
      return flag;
    }
    
    formatDate(date) {
      let arDate = date.split('-');
      return `${arDate[2]}.${arDate[1]}.${arDate[0]}`
    }
    
    renderTitleSelect() {
      if(this.labelData.length > 1) {
        this.selectTitle.innerHTML = `<option></option>`;
        for(let key in this.labelData) {
          this.selectTitle.innerHTML += `<option value=${key}>${this.labelData[key].title}</option>`;
        }
      } else {
        this.selectTitle.innerHTML = `<option value=0>${this.labelData[0].title}</option>`;
        if(this.labelData[0].totalCount) {
          this.labelForm.elements.count.value = this.labelData[0].totalCount;
        };
      }
    }

    update(data) {
      this.date = data.date;
      this.labelData = data.data;
      this.renderTitleSelect();
    }

    show() {
      this.view.querySelector('#main-wrapper').classList.remove('is-hidden');
    }

    print(view) {
      const WinPrint = window.open('','','left=50,top=50,width=1920,height=1080,toolbar=0,scrollbars=1,status=0');
          WinPrint.document.write(view);
          WinPrint.document.close();
          WinPrint.focus();
          setTimeout(()=> {
              WinPrint.print();
              WinPrint.close();
              this.labelForm.reset();
          },1500);
    }

    generateLabels() {
      this.requestRenderLabels()
          .then(result => {
              this.print(result);
          });
    }

    injection(key, obj) {
      this[key] = obj;
    }
    
    constructor() {

      this.view = document.createElement('div');
      this.view.innerHTML = this.template;

      this.selectTitle = this.view.querySelector('#select-title');
      this.btnPrint = this.view.querySelector('#button-print');
      this.labelForm = this.view.querySelector('#label-form');

      this.btnPrint.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.validate(this.labelForm.elements)) {
          this.printParams = {
            title: this.labelData[this.labelForm.elements.title.value].title,
            labelName: this.unit.labelName,
            num: this.labelForm.elements.num.value,
            orderNum: this.labelForm.elements.ordernum.value,
            date: this.formatDate(this.labelForm.elements.date.value),
            totalCount: this.labelForm.elements.count.value,
            maxItemsInPack: this.labelForm.elements.countpack.value,
            size: this.labelForm.elements.size.value,
            data: this.labelData[this.labelForm.elements.title.value].data
          };
          this.generateLabels();
        }        
      });
    }
}