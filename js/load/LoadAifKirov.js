import Loader from './Loader.js';

export default class LoadAifKirov extends Loader {

    // separatedData = [];
    // labelData = [];

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'aifkirov', 'customer': 'АиФ-Киров', 'labelName': 'Аргументы и факты, АО'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    parse(inputData) {
        let begin = false;
        let parsedData = {title: 'Аргументы и факты', data: []};

        let inputDataArray = inputData.split('\r\n');
                
        for(let item of inputDataArray) {
            let itemArray = item.replace(/(\d+),(\d+)/g,'$1$2').split(';');
            if (begin) {
                parsedData.data.push({title: itemArray[0], value: parseInt(itemArray[3]) + parseInt(itemArray[4])});
            }
            if (itemArray[0].search('---') === 0) {
                begin = !begin;
            }
        }
        parsedData.data.pop();
        console.log(parsedData);
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