var Nodes = new Mongo.Collection("nodes");
var Edges = new Meteor.Collection("edges");


function initCy(){

  cy = cytoscape({
    container: document.getElementById('cy'),
    ready: function(){
      console.log("network ready");
    },
    style: [ {
              selector : 'node',
                   css: {
                    'font-size': 12,
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'color': 'white',
                    'text-outline-width': 2,
                    'text-outline-color': '#888',
                    'min-zoomed-font-size': 8
                    // ,
                    // 'width': 'mapData(score, 0, 1, 20, 50)',
                    // 'height': 'mapData(score, 0, 1, 20, 50)'
                  }
            },
            {
              selector: 'edge',
              css: {
                'target-arrow-shape': 'triangle'
              }
            },
            // some style for the ext
            {
              selector: '.edgehandles-hover',
              css: {
                'background-color': 'red'
              }
            },
            {
              selector: '.edgehandles-source',
              css: {
                'border-width': 2,
                'border-color': 'red'
              }
            },
            {
              selector: '.edgehandles-target',
              css: {
                'border-width': 2,
                'border-color': 'red'
              }
            },
            {
              selector: '.edgehandles-preview, .edgehandles-ghost-edge',
              css: {
                'line-color': 'red',
                'target-arrow-color': 'red',
                'source-arrow-color': 'red'
              }
            }
          ]
  });


  Tracker.autorun(function(){
    cy.elements().remove();

    cy.add( Nodes.find().fetch() );
    cy.add( Edges.find().fetch() );

    cy.reset()

    // qtip
    cy.nodes().qtip({
          content:  function(){ return this.data('id'); }
    })

    // menu
    cy.cxtmenu({
        selector: 'node',
        commands: [
          {
            content: '<span class="fa fa-flash fa-2x"></span>',
            select: function(){
              console.log( this.id() );
            }
          },
          {
            content: '<span class="fa fa-star fa-2x"></span>',
            select: function(){
              console.log( this.data('name') );
            }
          },
          {
            content: 'Text',
            select: function(){
              console.log( this.position() );
            }
          }
        ]
      });

        // edgehandles
        // cy.edgehandles({});

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

    $('#add').on('click', function(){
      Meteor.call("addNode");
    });

    // add random nodes 
    $('#init').on('click', function(){
      Meteor.call("destroyCyData");
      Meteor.call("initCyData");
    });

      $('#colaLayout').on('click', function(){
        var layout = cy.makeLayout({ name: 'cola' });
        layout.run();
    }); 

      $('#arborLayout').on('click', function(){
        var layout = cy.makeLayout({ name: 'arbor' });
        layout.run();
    });

      $('#randomLayout').on('click', function(){
        var layout = cy.makeLayout({ name: 'random' });
        layout.run();
    });

      $('#circleLayout').on('click', function(){
        var layout = cy.makeLayout({ name: 'circle' });
        layout.run();
    });

      $('#gridLayout').on('click', function(){
        var layout = cy.makeLayout({ name: 'grid' });
        layout.run();
    });

      $('#draw-on').on('click', function(){
          cy.edgehandles('drawon');
    });

    $('#draw-off').on('click', function(){
      cy.edgehandles('drawoff');
    });

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Meteor.call("destroyCyData"); // reset all nodes on startup
  });

  Meteor.publish('edges', function() {
    return Edges.find();
  });

  Meteor.publish('nodes', function() {
    return Nodes.find();
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
