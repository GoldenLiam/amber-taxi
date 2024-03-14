module.exports = {
    convertPickerDateToDBDate(inputPickerDate) {
        try {
            const d = new Date(inputPickerDate);

            let month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');

        } catch (error) {
            throw error;
        }
    },

    convertDBDateToTableDate(inputDBDate){
        try {
            const d = new Date(inputDBDate);

            let month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [month, day, year].join('-');

        } catch (error) {
            throw error;
        }
    },

    convertPickerTimeToDBTime(inputPickerTime) {
        try {
            const d = new Date(inputPickerTime);

            let hours = '' + d.getHours(),
                minutes = '' + d.getMinutes(),
                seconds = '' + d.getSeconds();
            return [hours, minutes, seconds].join(':');

        } catch (error) {
            throw error;
        }
    }
}