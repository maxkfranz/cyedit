var Nodes = new Mongo.Collection("nodes");
var Edges = new Meteor.Collection("edges");

function initCy(){

  cy = cytoscape({
    container: document.getElementById('cy')
  });

  Tracker.autorun(function(){
    cy.elements().remove();

    cy.add( Nodes.find().fetch() );
    cy.add( Edges.find().fetch() );

    cy.reset()
  });

  cy.on('drag', 'node', /*_.debounce(*/function( e ){

    var node = e.cyTarget;
    var nodeDoc = Nodes.findOne({ "data.id" : node.id() });

    Nodes.update({
      _id: nodeDoc._id
    }, {
      $set: { position: node.position() }
    });
  }/*, 100)*/);
}

if( Meteor.isClient ){

  Meteor.subscribe('nodes');
  Meteor.subscribe('edges');
  
  $(function(){
    FastClick.attach( document.body );
    
    initCy();

    // add random nodes 
    $('#add').on('click', function(){
      Meteor.call("initCyData");
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Meteor.call("destroyCyData"); // reset all nodes on startup
  });
}


Meteor.methods({
    addNode: function () {
        Nodes.insert({
          group: 'nodes',
          data: {
            id: 'node' + Math.round( Math.random() * 1000000 )
          },
          position: {
            x: Math.random() *800,
            y: Math.random() *600
          }
        });
    },
    addEdge : function (source, target) {
         Edges.insert({
            group: 'edges',
            data: {
              "source" :source.data.id,
              "target" :target.data.id
            }
          });
    },
    deleteNode: function (nodeId) {
      
        var node = Nodes.findOne(nodeId);
        Nodes.remove(nodeId);
    },
    initCyData : function(){

        for(i = 0; i < 20; i++)
            Meteor.call("addNode");

        // add Edges
        for(i = 0; i < 10; i++){
          var source = Random.choice(Nodes.find().fetch());
          var target = Random.choice(Nodes.find({_id:{$ne:source._id}}).fetch());//make sure we dont connect to the source

          Meteor.call("addEdge", source, target);

        }
    },
    destroyCyData: function() {
        Nodes.remove({})
        Edges.remove({})
        // Nodes.find({}).forEach(function(node){
        //     Nodes.remove({_id:node._id});
        // });
        // Edges.find({}).forEach(function(edge){
        //     Edges.remove({_id:edge._id});
        // });
    }
});
