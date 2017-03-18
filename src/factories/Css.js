export default {
    objectToCss:function(obj = {marginLeft:0,paddingLeft:0}){
        let cssString = '';
        for (let prop in obj){
            if (obj.hasOwnProperty(prop)) {
                cssString += prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ':' + obj[prop]+';';
            }
        }
        return cssString;
    },
    getStylesheet:function(id){
        let styleSheets = document.styleSheets;
        for (let i=0; i < styleSheets.length;i++){
            if (styleSheets[i].ownerNode.id===id) return styleSheets[i];
        }
        return false;
    }
}
