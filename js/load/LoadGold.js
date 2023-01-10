import Loader from './Loader.js';

export default class LoadRG extends Loader {

    separatedData = [];
    labelData = [];

    parse(inputData) {
        let parsedData = {};
        for(let key in inputData) {
            if(key[0] != '!') {
                parsedData[key] = inputData[key]['w'].trim();
            }
        }
        let dataBegin = false;
        let data = {title: 'Газета Highland Gold', data: [], totalCount: 0};
        for(let key in parsedData) {
            if (dataBegin) {
                if((key[0]=='A') && (parsedData[key] != 'ИТОГО')) {
                    let tmp = {};
                    tmp.title = parsedData[key];
                    let valueKey = key.replace('A','C');
                    tmp.value = parseInt(parsedData[valueKey]);
                    let addressKey = key.replace('A','B');
                    tmp.address = parsedData[addressKey];
                    data.totalCount += parseInt(tmp.value);
                    data.data.push(tmp);
                }            
            };
            if (parsedData[key] == 'АКТИВ') {
                dataBegin = true;
            };            
        }
        data.totalCount = data.totalCount/2;
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