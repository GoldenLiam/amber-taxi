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
    },

    /**
     * 
     * @param {*} inputSecond has Float format 0.00
     */
    convertSecondToHMSTimeFormat(inputSecond){
        try {
            
            let hours = Math.floor(inputSecond / 3600);
            inputSecond %= 3600;
            let minutes = Math.floor(inputSecond / 60);
            let seconds = inputSecond % 60;
            return `${hours.toFixed(0)}:${minutes.toFixed(0)}:${seconds.toFixed(0)}`;

        } catch (error) {
            throw error;
        }
    },


    convertISODateStringToHMSTimeFormat(inputISODateString){
        try {
            let date = new Date(inputISODateString);

            // Lấy giờ, phút, giây
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            return `${hours}:${minutes}:${seconds}`;

        } catch (error) {
            throw error;
        }
    },


    convertISODateStringToHMTimeFormat(inputISODateString){
        try {
            let date = new Date(inputISODateString);

            // Lấy giờ, phút, giây
            let hours = date.getHours();
            let minutes = date.getMinutes();

            return `${hours}:${minutes}`;

        } catch (error) {
            throw error;
        }
    },


    convertISODateStringToDMYHMSTimeFormat(inputISODateString){
        try {
            let date = new Date(inputISODateString);

            // Lấy ngày, tháng, năm
            let days = date.getDate();
            let months = date.getMonth();
            let years = date.getFullYear();

            // Lấy giờ, phút
            let hours = date.getHours();
            let minutes = date.getMinutes();

            return `${days}-${months+1}-${years} ${hours}:${minutes}`;

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