export default class ParseVillage {

    separatedData = [];
    labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'village', 'customer':this.inputCustomer.value};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    decChar(c) {
        return String.fromCharCode(c.charCodeAt(0) - 1);
    }
    
    getColumn(inputData, key, maxIndex, destinationData) {
        let valueChar = key[0];
        let titleChar = this.decChar(valueChar);
        let index = +key.substring(1);
        for(let i = index + 1; i<=maxIndex; i++) {
            if ((inputData[`${valueChar}${i}`]) && (inputData[`${titleChar}${i}`] != 'Итого:')) {
            destinationData.push({title: inputData[`${titleChar}${i}`], value: inputData[`${valueChar}${i}`]});
            };
        }
    }
    
    //exit point
    compileData(inputData) {
        for(let segment of inputData) {
            let tmp = {title: segment.title, data: []};
            let segmentData = segment.data;
            for(let key in segmentData) {
                if(segmentData[key] == 'Экз.') {
                    this.getColumn(segmentData, key, segment.lastIndex, tmp.data);
                }
            };
        this.labelData.push(tmp);
    }
    this.request('save', this.labelData)
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
    }
    
    separateData(inputData) {
        for(let key in inputData) {
            let index = +key.substring(1);
            let tmp = this.separatedData.filter((item) => {return (index > item.firstIndex && index < item.lastIndex)})[0];
            if(tmp) {
                tmp.data[key] = inputData[key];
            };    
        }
        this.compileData(this.separatedData);
    }
    
    createSegments(inputData) {
        for (let key in inputData) {
            if (inputData[key].match(/П[0-9]+/)) {
            if(this.separatedData.length>0) {
                this.separatedData[this.separatedData.length-1].lastIndex = key.substring(1)-1;
            };
            this.separatedData.push({
                firstIndex: +key.substring(1),
                title: inputData[key].replace(/П[0-9]+/, '').trim(),
                data: {}
            });
            }
        }
        this.separatedData[this.separatedData.length-1].lastIndex = 1000;
        this.separateData(inputData);  
    }
    
    parse(inputData) {
        let parsedData = {};
        for(let key in inputData) {
            if(key[0] != '!') {
                parsedData[key] = inputData[key]['w'].trim();
            }
        }
        this.createSegments(parsedData);
    }

    getFile(e) {
        console.log(e);
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        this.parse(workbook.Sheets['Лист1']);
    }
    
    handleFile(e) {
        if (this.inputCustomer.value) {
            this.labelData = [];
            let files = e.target.files, f = files[0];
            let reader = new FileReader();
            reader.addEventListener('load', (e) => {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, {type: 'array'});
                this.parse(workbook.Sheets['Лист1']);
            });
            reader.readAsArrayBuffer(f);
        } else {
            this.notificationWarning.classList.remove('is-hidden');
        }
        
    };

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('field', 'is-grouped');

        const labelCustomer = document.createElement('label');
        labelCustomer.classList.add('label');
        labelCustomer.innerText = 'Введите заказчика';
        
        this.inputCustomer = document.createElement('input');
        this.inputCustomer.classList.add('button', 'ml-4');
        this.inputCustomer.type = 'text';

        const label = document.createElement('label');
        label.classList.add('label', 'ml-6');
        label.innerText = 'Выберите файл';
        
        const input = document.createElement('input');
        input.classList.add('button', 'ml-4');
        input.type = 'file';

        input.addEventListener('change', this.handleFile.bind(this), false);

        this.notification = document.createElement('div');
        this.notification.classList.add('notification', 'is-primary', 'is-light', 'is-hidden');
        this.notification.innerText = 'Данные загружены';

        this.notificationWarning = document.createElement('div');
        this.notificationWarning.classList.add('notification', 'is-danger', 'is-light', 'is-hidden');
        this.notificationWarning.innerText = 'Введите заказчика';

        this.view.appendChild(labelCustomer);
        this.view.appendChild(this.inputCustomer);
        this.view.appendChild(label);
        this.view.appendChild(input);
        this.view.appendChild(this.notification);
        this.view.appendChild(this.notificationWarning);
    }

    constructor() {
        this.render();
    }
}