Template.contextual.events= {

    'click #closeInfoBox' : function(event){
        // console.log('close infoBox');
        $("#infoBox").css('visibility', 'hidden');
    }

};

Template.infobox.helpers({

    onSuccess: function () {
        return function (res, val) {
            Meteor.call("updateNameByType", Session.get('currentId'), Session.get('currentType'), val);
        }
    },

     currentSelection: function() {
        var id= Session.get('currentId'),
            type = Session.get('currentType'),
            item = {};


       if( type == "node") {
            item= Nodes.findOne({"data.id" : id});
        } else if (type== "edge"){
            item= Edges.findOne({"data.id" : id});
        }

        return item;
    }
})

Template.comments.helpers({
    comments: function() {
        return comments = Comments.find({"id" : Session.get('currentId'),  "type" : Session.get('currentType')}).fetch();
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
