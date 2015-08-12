
// add/remove nodes
$('#add').on('click', function(){
  Meteor.call("addNode");
});

// add random nodes 
$('#init-data').on('click', function(){
  console.log('init');
  // Meteor.call("resetNetworkData");
});


// layouts
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

// add remove edges
$('#draw-on').on('click', function(){
      cy.edgehandles('drawon');
});

$('#draw-off').on('click', function(){
  cy.edgehandles('drawoff');
});
