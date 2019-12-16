/**
 * Lists and return all links in the content of the mail specified.
 */
function getLinks(data, unique) {
  var hrefArr = new Array();
  var uniKey = new Array();
  
  var sortLink = function(text) {
    var textSorted = text.substring(0, data.indexOf('"'));
    var indexKey = textSorted.indexOf("p2=");
    if(indexKey > -1 && text.indexOf("[push") > -1) {
      var stg = textSorted.substring(indexKey + 3);
      // test if the link code is already in the uniKey array
      if(uniKey.indexOf(stg.substring(0, stg.indexOf('&'))) == -1 && stg.substring(0, 1) != '?' && stg.substring(0, 1) != '/') {
        // test if the link is already in the final array
        if(unique.indexOf(textSorted) == -1) { 
          hrefArr.push(textSorted);
          uniKey.push(stg.substring(0, stg.indexOf('&')));
        }
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