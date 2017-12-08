export default {
    getElementPosition:function(key,val,arr){
        for (let i=0;i<arr.length;i++){
            if (arr[i][key]===val) return i;
        }
        return false;
    },
    objectAvailableByKey:function(key,val,arr){
        for (let item of arr){
            if (item[key]===val) return true;
        }
        return false;
    }
}
