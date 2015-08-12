Template.infobox.helpers({
     currentSelection: function() {

        var current = [];
        var id = Session.get('currentId');

        if(Session.get('currentType') == "node") {
            current= Nodes.findOne({"data.id" : id});
        } else if (Session.get('currentType') == "edge"){
            current= Edges.findOne({"data.id" : id});
        } 

        return current;
    }
})

Template.comments.helpers({
    comments: function() {
        var comments = Comments.find({"id" : Session.get('currentId'),  "type" : Session.get('currentType')}).fetch();
        console.log(comments);
        return comments;
    }
})

Template.commentForm.events = {
  'click #submit': function(event){

    event.preventDefault();
    var body = $('#body').val();
    $('#body').val('');

    Meteor.call("addComment", Session.get('currentId'), Session.get('currentType'), body)

  }
}
