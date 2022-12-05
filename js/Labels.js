export default class Labels {

    renderLabel(title, quantity) {
        let view = `
        <table class="table is-bordered has-text-centered">
        <tr>
            <td rowspan="6" class="py-6 is-vcentered"><img src="img/pic.png"></td>
            <td class="has-text-weight-bold is-size-3">Не бросать!</td>
            <td rowspan="6" class="is-vcentered p-0"><div class="has-text-weight-bold is-size-2 zakaz">Заказ ${this.data.orderNum}</div></td>
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
      
    printLabels() {
    const viewPrint = document.createElement('div');
    for(let item of this.data.data) {
        console.log(item.labelsFullPackCount)
        let i=0;
        while(i<item.labelsFullPackCount) {
        viewPrint.innerHTML += this.renderLabel(item.title, this.data.maxItemsInPack);
        i++;
        }
        viewPrint.innerHTML += this.renderLabel(item.title, item.labelTail);
    };
    
    const WinPrint = window.open('','','left=50,top=50,width=1920,height=1080,toolbar=0,scrollbars=1,status=0');
        WinPrint.document.write(`<link rel="stylesheet" href="../css/bulma.min.css">`);
        WinPrint.document.write(`<link rel="stylesheet" href="../css/printstyle.css">`);
        WinPrint.document.write(viewPrint.innerHTML);
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
    this.printLabels();
    }

    constructor(data) {
        console.log(data);
        this.data = data;
        this.generateLabels();
    }
    
}