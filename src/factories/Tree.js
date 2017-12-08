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
    }
};

export default TreeFactory;
