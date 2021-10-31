const { FindCorrectWord } = require('./FindCorrectWord');

class Address {
    
    #address;

    constructor(obj) {
        
        if (!!!obj) obj = {};

        this.#address = {
            house: obj.house || '',
            street: obj.street || '',
            area: obj.area || '',
            landmark: obj.landmark || '',
            village: obj.village || '',
            subdistrict: obj.subdistrict || '',
            district: obj.district || '',
            state: obj.state || '',
            pincode: obj.pincode || '',
        };
    }

    async enableSpellChecker(pinCode) {
        await FindCorrectWord.initDictonary(pinCode);
    }
    
    static isValidAddress(addrObj) {
        const missingImportantFields = Object.keys(addrObj).filter(a => addrObj[a] === '' && !(a === 'house' || a === 'street' || a === 'landmark' || a === 'area'));
            
        return missingImportantFields.length < 1;
    }
    
    static removeEndCommaAndSpecialChars(addrObj) {
        Object.keys(addrObj).forEach(field => {
            addrObj[field] = addrObj[field].toString().trim().replace(/,\s*$/, '').replace(/[^0-9.,\sa-zA-Z]/g, '');
        });
        return addrObj;
    }

    static getCorrectWords(sentence) {
        console.log(typeof(sentence));
        if (typeof(sentence) == 'string') {
            
            let words = sentence.split(' ');
            
            for (let i in words) {
                words[i] = FindCorrectWord.getCorrectWord(words[i]);
            }
            words = words.join(' ');
            return words.charAt(0).toUpperCase() + words.slice(1);
            // return words.join(' ').charAt(0).toUpperCase().slice(1);
        }
        console.log(sentence);
        return sentence;
    }

    correctSpellingMistakes(addrObj) {

        // addrObj['house'] = this.getCorrectWords(addrObj['house']);
        // addrObj['street'] = this.getCorrectWords(addrObj['street']);
        // addrObj['area'] = this.getCorrectWords(addrObj['area']);
        // addrObj['landmark'] = this.getCorrectWords(addrObj['landmark']);
        
        addrObj['landmark'] = Address.getCorrectWords(addrObj['landmark']);
        addrObj['subdistrict'] = Address.getCorrectWords(addrObj['subdistrict']);
        addrObj['district'] = Address.getCorrectWords(addrObj['district']);
        addrObj['state'] = Address.getCorrectWords(addrObj['state']);

        return addrObj;
    }
    
    getFinalAddress() {
        if (Address.isValidAddress(this.#address)) {
            this.#address = Address.removeEndCommaAndSpecialChars(this.#address);
            this.#address = this.correctSpellingMistakes(this.#address);
            return this.#address;
        }
        else {
            new Error('Invalid incoming address object.');
        }
    }

    getCurrentData() {
        return this.#address;
    }
}

module.exports = {
    Address
}