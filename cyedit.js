net=""; // main object to store a cytoscape graph 

if( Meteor.isClient ){

    // make sure the div is ready
    Template.network.rendered = function () {
        
        net = initNetwork();

        addQTip(net);
        addCxtMenu(net);
        addDrag(net);
        addEdgehandles(net);

        Tracker.autorun(function(){
            updateNetworkData(net);
        });
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
      // Meteor.call("resetNetworkData"); // reset all nodes and edges
    });
}

function initNetwork () {

    var colors = d3.scale.category20b();

    return cytoscape({
            container: document.getElementById('cy'),
            ready: function(){
              console.log("network ready");
              updateNetworkData(net); // load data when cy is ready
            },
            // style
            style: cytoscape.stylesheet()
            .selector('node')
                .style({
                        'content': function( e ){  return e.data("name")},
                        'background-color': function( e ){ return e.data("starred") ?  "yellow" : colors(e.data("group")) },
                        'font-size': 12,
                        'text-valign': 'center',
                        'color': 'white',
                        'text-outline-width': 2,
                        'text-outline-color': function( e ){ return e.locked() ?  "red" : "#888" },
                        'min-zoomed-font-size': 8
                         // 'width': 'mapData(score, 0, 1, 20, 50)',
                        // 'height': 'mapData(score, 0, 1, 20, 50)'
                })
            .selector('edge')
                .style({
                    'content': function( e ){ return e.data("name")? e.data("name") : "";},
                    'target-arrow-shape': 'triangle',
                })
            .selector('.edgehandles-hover')
                .style({
                     'background-color': 'red'
                })
            .selector('.edgehandles-source')
            .selector('.edgehandles-target')
            .selector('.edgehandles-preview, .edgehandles-ghost-edge')
                .style({
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                })

    });
}

function updateNetworkData(net) {

        // init Data
        var edges = Edges.find().fetch();
        var nodes = Nodes.find().fetch();

        net.elements().remove(); // make sure evything is clean
        
        if(nodes) net.add( nodes );
        if(edges) net.add( edges );
        
        net.reset() // render layout
}

function addQTip (net){
    // qtip
    net.nodes().qtip({
          content:  function(){ return this.data('id'); }
    })
}

// contextual menu
function addCxtMenu (net){
    net.cxtmenu({
        selector: 'node',
        commands: [
          {
            content: '<span class="fa fa-trash-o fa-2x"></span>',
            select: function(){
              
              // remove all connected edges
              this.neighborhood('edge').forEach(function(el,i) {
                // console.log(el.id());
                Meteor.call("deleteEdge",el.id());
              })

              // remove this node
              Meteor.call("deleteNode",this.id());

              // remove from graph
              net.remove( this.neighborhood('edge') )
              net.remove( this )
            }
          },
          {
            content: '<span class="fa fa-star fa-2x"></span>',
            select: function(){
              Meteor.call("starNode", this.id());
              this.style({
                'background-color': 'yellow'
              })
            }
          },
          {
            content:'<span class="fa fa-lock fa-2x"></span>',
            select: function(){
              // console.log( this.position() );
              Meteor.call("lockNode", this.id(), this.position());
            },
          },
          {
            content:'<span class="fa fa-comments-o fa-2x"></span>',
            select: function(){
              Meteor.call("addComment", this.id());
            },
            
          }
        ]
      });
}

// edgehandles
function addEdgehandles(net) {

    var onComplete = function( source, target, addedEntities ){
      Meteor.call("addEdge", source.data("id"), target.data("id"));
    }

    net.edgehandles({
        complete : onComplete
    });
};

// drag behaviour
function addDrag (net) {

    net.on('select', 'node', /*_.debounce(*/function( e ){
        var node = e.cyTarget;
        Session.set('currentType', "node");
        Session.set('currentId', node.id());
        $("#infoBox").css('visibility', 'visible');
    });

    net.on('select', 'edge', /*_.debounce(*/function( e ){
        var edge = e.cyTarget;
        console.log(edge);
        Session.set('currentType', "edge");
        Session.set('currentId', edge.id());
        $("#infoBox").css('visibility', 'visible');
    });

    net.on('drag', 'node', /*_.debounce(*/function( e ){
        var node = e.cyTarget;
        Meteor.call('updateNodePosition', node.id(), node.position());
    })
}

// function addClick (net) {
//     net.on('click', 'node', /*_.debounce(*/function( e ){
//         var node = e.cyTarget;
//         Meteor.call('selectNode', node.id());
//     })
// }






