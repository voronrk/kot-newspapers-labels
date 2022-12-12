export default class ParseVillage {

    // separatedData = [];
    // labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'aifkirov', 'customer': 'АиФ-Киров'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    decChar_DEPRECATED(c) {
        return String.fromCharCode(c.charCodeAt(0) - 1);
    }
    
    getColumn_DEPRECATED(inputData, key, maxIndex, destinationData) {
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
    compileData_DEPRECATED(inputData) {
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
    
    separateData_DEPRECATED(inputData) {
        for(let key in inputData) {
            let index = +key.substring(1);
            let tmp = this.separatedData.filter((item) => {return (index > item.firstIndex && index < item.lastIndex)})[0];
            if(tmp) {
                tmp.data[key] = inputData[key];
            };    
        }
        this.compileData(this.separatedData);
    }
    
    createSegments_DEPRECATED(inputData) {
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

    compileData(data) {

        this.request('save', [parsedData])
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
    }
    
    parse(inputData) {
        let begin = false;
        let parsedData = {title: 'Аргументы и факты', data: []};

        let inputDataArray = inputData.split('\r\n');
                
        for(let item of inputDataArray) {
            let itemArray = item.replace(/(\d+),(\d+)/g,'$1$2').split(';');
            console.log(itemArray);
            if (begin) {
                parsedData.data.push({title: itemArray[0], value: itemArray[3]});
            }
            if (itemArray[0].search('---') === 0) {
                begin = !begin;
            }
        }
        parsedData.data.pop();
        console.log(parsedData);
        // this.compileData(parsedData);
        this.request('save', [parsedData])
        .then(result => {
            if (result > 0) {
                this.notification.classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
        
    }

    // getFile(e) {
    //     console.log(e);
    //     let data = new Uint8Array(e.target.result);
    //     let workbook = XLSX.read(data, {type: 'array'});
    //     this.parse(workbook.Sheets['Лист1']);
    // }
    
    handleFile(e) {
        this.labelData = [];
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
            let data = e.target.result.replaceAll(/( ){3,}/g,';');
            this.parse(data);
        });
        reader.readAsText(file, 'CP1251');
    };

    render() {
        this.view = document.createElement('div');

        const label = document.createElement('label');
        label.classList.add('label');
        label.innerText = 'Выберите файл';
        
        const input = document.createElement('input');
        input.classList.add('button');
        input.type = 'file';

        input.addEventListener('change', this.handleFile.bind(this), false);

        this.notification = document.createElement('div');
        this.notification.classList.add('notification', 'is-primary', 'is-light', 'is-hidden');
        this.notification.innerText = 'Данные загружены';

        this.view.appendChild(label);
        this.view.appendChild(input);
        this.view.appendChild(this.notification);
    }

    constructor() {
        this.render();
    }
}