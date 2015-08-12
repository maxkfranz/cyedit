Meteor.publish('edges', function() {
    return Edges.find();
});

Meteor.publish('nodes', function() {
    return Nodes.find();
});

Meteor.publish('comments', function() {
    return Comments.find();
});
