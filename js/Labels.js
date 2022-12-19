export default class Labels {

    print(view) {
        const WinPrint = window.open('','','left=50,top=50,width=1920,height=1080,toolbar=0,scrollbars=1,status=0');
            WinPrint.document.write(`<link rel="stylesheet" href="../css/bulma.min.css">`);
            WinPrint.document.write(`<link rel="stylesheet" href="../css/printstyle.css?1">`);
            WinPrint.document.write(view);
            WinPrint.document.close();
            WinPrint.focus();
            setTimeout(()=> {
                WinPrint.print();
                WinPrint.close();
                labelForm.reset();
            },500);
    }

    async request() {
        const params={'data': this.data};
        const response = await fetch ('renderLabels.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    generateLabels() {
        this.request()
            .then(result => {
                console.log(result);
                this.print(result);
            });
    }

    constructor(data) {
        this.data = data;
        this.generateLabels();
    }    
}