module.exports = {

    /**
     * 
     * @param {*} inputDate has String format YYYY-MM-DD
     */
    convertDOBStringToISODate(inputDate){
        try {

            let dobDate = new Date( inputDate.replace("-", " ") );
            return dobDate.toISOString();

        } catch (error) {
            throw error;
        }
    }

    /* 
    cleanText: function(text) {
        // clean it and return
    },

    isWithinRange(text, min, max) {
        // check if text is between min and max length
    }
    */
}