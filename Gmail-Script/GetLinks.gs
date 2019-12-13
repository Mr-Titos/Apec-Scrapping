/**
 * Lists all links in the content of the mail specified.
 */
var hrefArr = new Array();
var uniKey = new Array();

function getLinks(data) {
  
  var sortLink = function(text) {
    var textSorted = text.substring(0, data.indexOf('"'));
    var indexKey = textSorted.indexOf("p2=");
    if(indexKey > -1 && text.indexOf("[push_avec_compte]") > -1) {
      var stg = textSorted.substring(indexKey + 3);
      if(uniKey.indexOf(stg.substring(0, stg.indexOf('&'))) == -1 && stg.substring(0, 1) != '?' && stg.substring(0, 1) != '/') {
        hrefArr.push(textSorted);
        uniKey.push(stg.substring(0, stg.indexOf('&')));
      }
    }
    return text.substring(text.indexOf('"') + 1);
  };
    try {
      while(data.toLowerCase().indexOf('href="') > -1) {
        data = data.substring(data.indexOf('href="') + 6);
        var zelda = sortLink(data);
        if(zelda != null)
          data = zelda;
        if(data.toLowerCase().indexOf('href="') == -1)
          return hrefArr;
      }
    } catch(err) { console.log("Error in sendLink(): " + err); }
}