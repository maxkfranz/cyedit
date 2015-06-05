Elements = new Mongo.Collection("elements");

function initCy(){
  cy = cytoscape({
    container: document.getElementById('cy')
  });
  
  Tracker.autorun(function(){
    cy.elements().remove();
    cy.add( Elements.find().fetch() ); // will get errors for duplicates but it will still work...
  });
  
  // more cytoscape code can go here...
  
  cy.on('drag', 'node', /*_.debounce(*/function( e ){
    var node = e.cyTarget;
    
    Elements.update({
      id: node.id()
    }, {
      $set: { position: node.position() }
    });
  }/*, 100)*/);
}

// add a new node to the graph
function addNode(){
  Elements.insert({
    group: 'nodes',
    data: {
      id: 'node' + Math.round( Math.random() * 1000000 )
    },
    position: {
      x: 0,
      y: 0
    }
  });
  
  Meteor.publish();
}

if( Meteor.isClient ){
  Meteor.subscribe('elements');
  
  $(function(){
    FastClick.attach( document.body );
    
    initCy();
    
    $('#add').on('click', function(){
      addNode();
    });
  });
}

if (Meteor.isClient) {
  // code is only run on client
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
