Template._header.events = {
    // add/remove nodes
    "click #add" :  function(){
      Meteor.call("addNode");
    },

    // add random nodes 
    "click #init-data": function(){
      console.log('init');
      // Meteor.call("resetNetworkData");
    },

    // layouts
    // TODO : make a function that saves positions to the db after layout has been applied
    'click #colaLayout' : function(){
      console.log("click");
        var layout = net.makeLayout({ name: 'cola' });
        layout.run();
    },

    'click #arborLayout' : function(){
        var layout = net.makeLayout({ name: 'arbor' });
        layout.run();
    },

    'click #randomLayout' : function(){
        var layout = net.makeLayout({ name: 'random' });
        layout.run();
    },

    'click #circleLayout' : function(){
        var layout = net.makeLayout({ name: 'circle' });
        layout.run();
    },

    'click #gridLayout' : function(){
        var layout = net.makeLayout({ name: 'grid' });
        layout.run();
    },

    // add remove edges
    // 'click #draw-on' : function(){
    //       net.edgehandles('drawon');
    // },

    // 'click #draw-off : function(){
    //   net.edgehandles('drawoff');
    // }

}




