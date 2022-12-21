export default class Loader {

    async request(method, data=[]) {
        const params={'method': method, 'data': data, 'name': 'VID', 'customer': 'Вятский издательский дом', labelName: 'Вятский издательский дом, КОГАУ'};
        const response = await fetch ('back.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        return await response.json();
    }

    constructor(params) {
        

    }
    
}