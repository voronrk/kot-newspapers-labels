import Loader from './Loader.js';

export default class LoadAifKirov5ka extends Loader {

    separatedData = [];
    labelData = [];

    parse(inputData) {
        let parsedData = {};
        for(let key in inputData) {
            if((key[0] != '!') && (inputData[key]['t'] != 'e')) {
                parsedData[key] = inputData[key]['w'].trim();
            }
        }
        let data = this.unit.data;
        for(let key in parsedData) {
            if(parsedData[key].indexOf('Пятерочки_Киров №') === 0) {
                let testKey = key.replace('A','C');
                if(!parsedData[testKey]) {
                    let valueKey = key.replace('A','D');
                    let tmp = {};
                    tmp.title = parsedData[key];
                    tmp.value = parseInt(parsedData[valueKey]);
                    
                    let issetElement = data.data[0].data.find((item) => {return item.title == tmp.title});
                    if (issetElement) {
                        data.data[0].totalCount = data.data[0].totalCount - issetElement.value - parseInt(tmp.value);
                        issetElement.value = tmp.value;
                    } else {
                        data.data[0].totalCount += parseInt(tmp.value);
                        data.data[0].data.push(tmp);
                    };                    
                };
            }
        }
        this.data = data.data;
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