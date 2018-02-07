import { Style, State, Element } from '../structures/Element';
import { merge } from 'lodash';
const TreeFactory = {
    InsertElementsAfter:function(where,id,elements){
        let searchTree = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    for (let element of elements) {
                        so.splice(j,0,element);
                    }
                    break;
                } else {
                    var c = searchTree(io.children);
                    if ((io.children.length > 0) && (c)) return c;
                }
            }
            return where;
        };
        return searchTree(where.children);
    },
    InsertElementsBefore:function(where,id,elements){
        let searchTree = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    for (let element of elements) {
                        so.splice(j+1,0,element);
                    }
                    break;
                } else {
                    var c = searchTree(io.children);
                    if ((io.children.length > 0) && (c)) return c;
                }
            }
            return where;
        };
        return searchTree(where.children);
    },
    getElementIndex:function(where,id){
        for (var j=0;j<where.length; j++) {
            var io = where[j];
            if (io.id===id){
                return j;
            }
        }
        return false;
    },
    getParentArray:function(where,id){
        let searchTree = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    return so;
                } else {
                    var c = searchTree(io.children);
                    if ((io.children.length > 0) && (c)) return c;
                }
            }
            return null;
        };
        return searchTree(where);
    },
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
    removeElementById:function(where,id){
        let nuWhere = merge({},where);
        let filterChildren = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    so.splice(j,1);
                    break;
                } else {
                    so[j].children = filterChildren(so[j].children);
                }
            }
            return so;
        };
        nuWhere.children = filterChildren(nuWhere.children);
        return nuWhere;
    },
    spliceElementById:function(where,id){
        let filterChildren = function(so){
            for (var j=0;j<so.length; j++) {
                var io = so[j];
                if (io.id===id){
                    return so.splice(j,1);
                } else {
                    so[j].children = filterChildren(so[j].children);
                }
            }
            return false;
        };
        return filterChildren(where.children);
    },
    makeId:function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        text+= '_'+new Date().getTime();
        return text;
    },
    generateElement:function(where,label,type,style){
        let baseStyle = merge({},Style,style);
        let baseState = merge({},State,{
            id:this.makeId(),
            style:baseStyle
        });
        let baseElement = merge({},Element,{
            id:this.makeId(),
            type:type,
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
