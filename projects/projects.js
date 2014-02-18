var colors = {
  "Arduino": "#bd79d1",
  "Java": "#b07219",
  "VHDL": "#543978",
  "Scala": "#7dd3b0",
  "Emacs Lisp": "#c065db",
  "Delphi": "#b0ce4e",
  "Ada": "#02f88c",
  "VimL": "#199c4b",
  "Perl": "#0298c3",
  "Lua": "#fa1fa1",
  "Rebol": "#358a5b",
  "Verilog": "#848bf3",
  "Factor": "#636746",
  "Ioke": "#078193",
  "R": "#198ce7",
  "Erlang": "#949e0e",
  "Nu": "#c9df40",
  "AutoHotkey": "#6594b9",
  "Clojure": "#db5855",
  "Shell": "#5861ce",
  "Assembly": "#a67219",
  "Parrot": "#f3ca0a",
  "C#": "#5a25a2",
  "Turing": "#45f715",
  "AppleScript": "#3581ba",
  "Eiffel": "#946d57",
  "Common Lisp": "#3fb68b",
  "Dart": "#cccccc",
  "SuperCollider": "#46390b",
  "CoffeeScript": "#244776",
  "XQuery": "#2700e2",
  "Haskell": "#29b544",
  "Racket": "#ae17ff",
  "Elixir": "#6e4a7e",
  "HaXe": "#346d51",
  "Ruby": "#701516",
  "Self": "#0579aa",
  "Fantom": "#dbded5",
  "Groovy": "#e69f56",
  "C": "#555",
  "JavaScript": "#f15501",
  "D": "#fcd46d",
  "ooc": "#b0b77e",
  "C++": "#f34b7d",
  "Dylan": "#3ebc27",
  "Nimrod": "#37775b",
  "Standard ML": "#dc566d",
  "Objective-C": "#f15501",
  "Nemerle": "#0d3c6e",
  "Mirah": "#c7a938",
  "Boo": "#d4bec1",
  "Objective-J": "#ff0c5a",
  "Rust": "#dea584",
  "Prolog": "#74283c",
  "Ecl": "#8a1267",
  "Gosu": "#82937f",
  "FORTRAN": "#4d41b1",
  "ColdFusion": "#ed2cd6",
  "OCaml": "#3be133",
  "Fancy": "#7b9db4",
  "Pure Data": "#f15501",
  "Python": "#3581ba",
  "Tcl": "#e4cc98",
  "Arc": "#ca2afe",
  "Puppet": "#cc5555",
  "Io": "#a9188d",
  "Max": "#ce279c",
  "Go": "#8d04eb",
  "ASP": "#6a40fd",
  "Visual Basic": "#945db7",
  "PHP": "#6e03c1",
  "Scheme": "#1e4aec",
  "Vala": "#3581ba",
  "Smalltalk": "#596706",
  "Matlab": "#bb92ac",
  "C#": "#bb92af",
  "CSS": "#1f085e"
}

//Templates
var source   = $("#gitRepos").html();
var template = Handlebars.compile(source);
source   = $("#collabs").html();
var template2 = Handlebars.compile(source);


var gotCollabs = function(id){
  return function(collabs){
    $('#collabs_num'+id).append(collabs.length);
    for (var j = 0; j < collabs.length; j++) {
      $('#collabs'+id).append(template2(collabs[j]));
    }
  }
}
var gotNumbers = function(element){
  return function(array){
    element.append(array.length);
  }
}
var gotLanguage = function(id){
  return function(array){
    var sum = 0;
    for (var key in array) {
      sum += array[key];
    }
    var table = $('<table></table>');
    var thead = $('<thead></thead>');
    for (var key in array) {
      var ul = $('<ul></ul>');
      ul.css('list-style-type', 'square');
      var li = $('<li></li>')
      var span = $('<span></span>');
      li.css('color', colors[key]);
      li.css('float', 'left');
      span.append(key + " " + (array[key]*100/sum).toFixed(2) + "% ");
      li.append(span);
      ul.append(li);
      var th = $('<th></th>');
      th.append(ul);
      thead.append(th);
    }
    table.append(thead);
    $('#language'+id).append(table);
    for (var key in array) {
      if(sum != 0){
        bar = $("<div class='languageBar'></div>");
        bar.width(array[key]*100/sum+"%");
        bar.css("background-color", colors[key]);
        link = $("<a href='#'></a>");
        bar.prop('title', key);
        link.append(bar);
        $('#language'+id).append(link);
      }
    }
  }
}

var sortFunc = function(repo1, repo2){
  var date1 = new Date(repo1.updated_at);
  var date2 = new Date(repo2.updated_at);
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
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
var gotTheData = function(data){
  // console.log(data);
  data.sort(sortFunc);
  for (var i = 0; i < data.length; i++) {
    // console.log(new Date(data[i].created_at));
    $('#gitReposData').append(template(data[i]));
    $.get((data[i].collaborators_url.replace('{/collaborator}','')), gotCollabs(data[i].id));
    $.get((data[i].commits_url.replace('{/sha}','')), gotNumbers($('#commits'+ data[i].id)));
    $.get((data[i].branches_url.replace('{/branch}','')), gotNumbers($('#branches'+ data[i].id)));
    $.get((data[i].languages_url), gotLanguage(data[i].id));
  };
}
$(document).ready(function(){
  var user = getQueryVariable('user');
  if(!user)
    user = 'mayank127';
  document.title = user + 'Git Projects'
  $('#backLink').attr('href','../?user='+user);
  $.get("https://api.github.com/users/" + user + "/repos", gotTheData);
});

