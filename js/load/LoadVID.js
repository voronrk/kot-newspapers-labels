import Loader from './Loader.js';

export default class LoadVID extends Loader {

    separatedData = [];
    labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'VID', 'customer': 'Вятский издательский дом', labelName: 'Вятский издательский дом, КОГАУ'};
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
        this.labelData = [];
        let files = e.target.files, f = files[0];
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, {type: 'array'});
            this.parse(workbook.Sheets['Лист1']);
        });
        reader.readAsArrayBuffer(f);
    };


}