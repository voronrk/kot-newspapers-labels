import Loader from './Loader.js';

export default class LoadKirPravda extends Loader {

    separatedData = [];
    labelData = [];

    parse(inputData) {
        let parsedData = {};
        let begin = false;
        for(let key in inputData) {
            if(key[0] != '!') {
                parsedData[key] = inputData[key]['w'].trim();
            }
        }
        console.log(parsedData);
        let data = {title: 'Кировская правда', data: [], totalCount: 0};
        for(let key in parsedData) {
            if(key[0]=='A') {
                if(begin && (parsedData[key] != 'ИТОГО:') && (parsedData[key] != 'Итого')) {
                    let tmp = {};
                    tmp.title = parsedData[key];
                    let valueKey = key.replace('A','B');
                    tmp.value = parseInt(parsedData[valueKey]);
                    data.totalCount += tmp.value;
                    data.data.push(tmp);
                }                
            }            
            if(parsedData[key] == 'Упаковка тиража:') {
                begin = true;
            }
            if((parsedData[key] == 'ИТОГО:') || (parsedData[key] == 'Итого')) {
                begin = false;
            }
        }
        data.totalCount = data.totalCount;
        this.data = [data];
        console.log(this.data);
        this.save();
    }

    handleFile(e) {
        this.labelData = [];
        let files = e.target.files, f = files[0];
        let reader = new FileReader();
        reader.addEventListener('load', (e) => {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, {type: 'array'});
            this.parse(workbook.Sheets[Object.keys(workbook.Sheets)[0]]);
        });
        reader.readAsArrayBuffer(f);
    };
}