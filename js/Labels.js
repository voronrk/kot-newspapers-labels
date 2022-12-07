export default class Labels {

    renderLabelA4(title, quantity) {
        let view = `
        <table class="table table-A4 is-bordered has-text-centered">
        <tr>
            <td rowspan="6" class="py-6 is-vcentered"><img class="img-A4" src="img/pic.png"></td>
            <td class="has-text-weight-bold is-size-3">Не бросать!</td>
            <td rowspan="6" class="is-vcentered p-0"><div class="has-text-weight-bold is-size-2 zakaz-A4">Заказ ${this.data.orderNum}</div></td>
        </tr>
        <tr><td class="np-title is-size-3">Вятский издательский дом, КОГАУ</td></tr>
        <tr><td class="has-text-weight-bold is-size-1 p-0 np-title"><span>${this.data.title}</span><br> № ${this.data.num} от ${this.data.date}<br><br>${title}</td></tr>
        <tr><td class="has-text-right np-title is-size-3">В пачке <span class="is-size-2 has-text-weight-bold">${quantity}</span> экз.</td></tr>
        <tr><td class="is-size-4">ООО "Элефант"<br>
        Россия, 610004, г. Киров, ул. Ленина, 2Б</td></tr>
        <tr><td class="has-text-weight-bold is-size-4">2022</td></tr>        
      </table>
      `;
      return view;
    }

    renderLabelA6(title, quantity) {
        let view = `
        <table class="table table-A6 is-bordered has-text-centered mb-6">
        <tr>
            <td rowspan="6" class="py-2 is-vcentered"><img class="img-A6" src="img/pic.png"></td>
            <td class="has-text-weight-bold is-size-5 p-0">Не бросать!</td>
            <td rowspan="6" class="is-vcentered p-0"><div class="has-text-weight-bold is-size-4 has-text-centered zakaz-A6">Заказ ${this.data.orderNum}</div></td>
        </tr>
        <tr><td class="np-title is-size-6">Вятский издательский дом, КОГАУ</td></tr>
        <tr><td class="has-text-weight-bold is-size-4 p-0 np-title"><span>${this.data.title}</span><br><span class="has-text-weight-normal">№ ${this.data.num} от ${this.data.date}</span><br><p>${title}</p></td></tr>
        <tr><td class="has-text-right np-title is-size-5">В пачке <span class="is-size-4 has-text-weight-bold">${quantity}</span> экз.</td></tr>
        <tr><td class="is-size-6">ООО "Элефант"<br>
        Россия, 610004, г. Киров, ул. Ленина, 2Б</td></tr>
        <tr><td class="has-text-weight-bold is-size-6 p-0">2022</td></tr>        
      </table>
      `;
      return view;
    }
          
    renderPageA4() {
        const view = document.createElement('div');
        for(let item of this.data.data) {
            console.log(item.labelsFullPackCount)
            let i=0;
            while(i<item.labelsFullPackCount) {
            view.innerHTML += this.renderLabelA4(item.title, this.data.maxItemsInPack);
            i++;
            }
            view.innerHTML += this.renderLabelA4(item.title, item.labelTail);
        };
        this.print(view);
    }

    renderPageA6() {
        const view = document.createElement('div');
        view.classList.add('columns');
        const columnLeft = document.createElement('div');
        columnLeft.classList.add('column', 'is-half');
        const columnRight = document.createElement('div');
        columnRight.classList.add('column', 'is-half');
        let leftColumn = true;
        for(let item of this.data.data) {
            let i=0;
            while(i<item.labelsFullPackCount) {
                if (leftColumn) {
                    columnLeft.innerHTML += this.renderLabelA6(item.title, this.data.maxItemsInPack);
                    leftColumn = !leftColumn;
                } else {
                    columnRight.innerHTML += this.renderLabelA6(item.title, this.data.maxItemsInPack);
                    leftColumn = !leftColumn;
                };
                i++;
            }
            if (leftColumn) {
                columnLeft.innerHTML += this.renderLabelA6(item.title, item.labelTail);
                leftColumn = !leftColumn;
            } else {
                columnRight.innerHTML += this.renderLabelA6(item.title, item.labelTail);
                leftColumn = !leftColumn;
            };
        };
        view.appendChild(columnLeft);
        view.appendChild(columnRight);
        this.print(view);
    }
    
    print(view) {
        const WinPrint = window.open('','','left=50,top=50,width=1920,height=1080,toolbar=0,scrollbars=1,status=0');
            WinPrint.document.write(`<link rel="stylesheet" href="../css/bulma.min.css">`);
            WinPrint.document.write(`<link rel="stylesheet" href="../css/printstyle.css?1">`);
            WinPrint.document.write(view.outerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            setTimeout(()=> {
                WinPrint.print();
                // WinPrint.close();
                // labelForm.reset();
            },500);
    }

    calculateEditorialPart() {
        let sum = 0;
        for(let item of this.data.data) {
          sum += +item.value;
        };
        return this.data.totalCount - sum;
    }
      
    generateLabels() {
        this.data.data.push({title:'Редакция', value: this.calculateEditorialPart()})
        for(let item of this.data.data) {
            item['labelsFullPackCount'] = Math.floor(item.value/this.data.maxItemsInPack);
            item['labelTail'] = item.value % this.data.maxItemsInPack;
        }
        console.log(this.data);
        switch (this.data.size) {
            case "A4": 
                this.renderPageA4();
                break;
            case "A6": 
                this.renderPageA6();
                break;
        }
    }

    constructor(data) {
        console.log(data);
        this.data = data;
        this.generateLabels();
    }    
}