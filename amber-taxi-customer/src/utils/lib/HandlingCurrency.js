module.exports = {

    /**
     * 
     * @param {*} floatNumber has Float format 0.00
     */
    convertFloatNumberToVNDFormat(floatNumber){
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(floatNumber);
    }

}