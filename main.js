var source   = $("#gitProfile").html();
var template = Handlebars.compile(source);
source   = $("#follow").html();
var template2 = Handlebars.compile(source);

var gotFollowers = function(data){
	for (var j = 0; j < data.length; j++) {
      $('#followingData').append(template2(data[j]));
    }
}

var gotTheData = function(data){
  $('#gitProfileData').append(template(data));
  $.get((data.following_url.replace('{/other_user}','')), gotFollowers);
}

var getQueryVariable = function(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
$(document).ready(function(){
  var user = getQueryVariable('user');
  if(!user)
    user = 'mayank127';
  document.title = user + 'Git Profile'
  $.get("https://api.github.com/users/" + user, gotTheData);
});