export default class ParseVillage {

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
        labelData.push(tmp);
    }

    request('save', labelData)
        .then(result => {
            if (result > 0) {
                document.querySelector('#data-loaded-notification').classList.remove('is-hidden');
                setTimeout(()=> {
                    location.reload();
                },500);        
            };
        });
    }
    
    separateData(inputData) {
        for(let key in inputData) {
            let index = +key.substring(1);
            let tmp = separatedData.filter((item) => {return (index > item.firstIndex && index < item.lastIndex)})[0];
            if(tmp) {
            tmp.data[key] = inputData[key];
            };    
        }
        this.compileData(separatedData);
    }
    
    createSegments(inputData) {
        for (let key in inputData) {
            if (inputData[key].match(/П[0-9]+/)) {
            if(separatedData.length>0) {
                separatedData[separatedData.length-1].lastIndex = key.substring(1)-1;
            };
            separatedData.push({
                firstIndex: +key.substring(1),
                title: inputData[key].replace(/П[0-9]+/, '').trim(),
                data: {}
            });
            }
        }
        separatedData[separatedData.length-1].lastIndex = 1000;
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
    
    handleFile(e) {
        labelData = [];
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            this.parse(workbook.Sheets['Лист1']);
        };
        reader.readAsArrayBuffer(f);
    };
}