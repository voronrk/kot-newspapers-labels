import Loader from './Loader.js';

export default class LoadAifKirov extends Loader {

    parse(inputData) {
        let begin = false;

        let inputDataArray = inputData.split('\r\n');
        let data = {title: 'Аргументы и факты', data: [], totalCount: 0};
                
        for(let item of inputDataArray) {
            let itemArray = item.replace(/(\d+),(\d+)/g,'$1$2').split(';');
            if (begin) {
                data.data.push({title: itemArray[0], value: parseInt(itemArray[3]) + parseInt(itemArray[4])});
            }
            if (itemArray[0].search('---') === 0) {
                begin = !begin;
            }
        }
        data.data.pop();
        this.data = [data];
        this.save();
    }
    
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


}