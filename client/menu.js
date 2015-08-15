function changeLayout (layoutName) {

    // TODO : make this function smoother for multi clients
    var savePositions = function () {
      for (var i = 0; i < net.nodes().length; i++) {
            var node = net.nodes()[i];
            Meteor.call("updateNodePosition", node.id(), node.position())
        }
    }

    var layout = net.makeLayout({ 
        name: layoutName,
        stop: savePositions // callback on layoutstop
    });
    layout.run();
}

Template._header.events = {
    // add/remove nodes
    "click #add" :  function(){ 
        var nodeId =  'node' + Math.round( Math.random() * 1000000 );

        Meteor.call("addNode", nodeId, "New Node") 
    },

    // add random nodes 
    "click #init-data": function(){  Meteor.call("resetNetworkData"); },

    // layouts
    'click #colaLayout' : function(){ changeLayout("cola") },
    'click #arborLayout' : function(){ changeLayout("cola") },
    'click #randomLayout' : function(){ changeLayout("random") },
    'click #circleLayout' : function(){ changeLayout("circle") },
    'click #gridLayout' : function(){ changeLayout("grid") },

    // toggle add/remove edges feature
    'click #draw-edgehandles' : function(){

        // var edgeHandlesOn = Session.get('edgeHandlesOn') == "drawoff" ? "drawon" : "drawoff";
        
        // var edgeHandlesOn = Session.get('edgeHandlesOn') == 'disable' ? 'enable' : 'disable';
        var edgeHandlesOn = Session.get('edgeHandlesOn') ? false : true ;
        Session.set('edgeHandlesOn', edgeHandlesOn);
        console.log(edgeHandlesOn);
        if (edgeHandlesOn)net.edgehandles.start();
    },



}




