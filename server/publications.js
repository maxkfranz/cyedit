Meteor.publish('edges', function() {
    return Edges.find();
});

Meteor.publish('nodes', function() {
    return Nodes.find();
});

Meteor.publish('comments', function() {
    return Comments.find();
});

// Meteor.publish('singleItem', function(id,type) {

//     var current = "";
//     if( type == "node") {
//             current= Nodes.findOne({"data.id" : id});
//         } else if (type== "edge"){
//             current= Edges.findOne({"data.id" : id});
//     }

//     console.log(current);
//     return current;
// });
