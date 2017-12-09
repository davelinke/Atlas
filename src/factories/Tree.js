import ElementStructures from '../structures/Element';
const TreeFactory = {
    getElementDataById:function(where,id){
        let searchTree = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    return io;
                } else {
                    var c = searchTree(io.children);
                    if ((io.children.length > 0) && (c)) return c;
                }
            }
            return false;
        };
        return searchTree(where);
    },
    makeId:function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        text+= '_'+new Date().getTime();
        return text;
    },
    generateElement:function(where,label,style){
        let baseStyle = Object.assign({},ElementStructures.style,style);
        let baseState = Object.assign({},ElementStructures.state,{
            id:this.makeId(),
            style:baseStyle
        });
        let baseElement = Object.assign({},ElementStructures.element,{
            id:this.makeId(),
            label:this.newLayerName(label,where),
            states:[baseState]
        });
        return baseElement;
    },
    checkLayerName:function(name,so){
        for (var j=0;j<so.length; j++) {
            var io = so[j];
            if (io.label===name){
                return true;
            } else {
                if ((io.children.length > 0) && (this.checkLayerName(name,io.children))) return true;
            }
        }
        return false;
    },
    newLayerName:function(pre, data){
        var
            i = 1,
            finalname
        ;
        while (i) {
            finalname = pre + ' ' + i;
            if (!this.checkLayerName(finalname,data)) return finalname;
            i++;
        }
    }
};

export default TreeFactory;
