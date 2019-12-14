/**
 * Send processed links to my API who process them
 */
function sendLinks(links) {
  var url = 'http://titos.dev';
  var port = ':26969';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    // Just delete JSON.stringify() if you want to send a JS object
    'payload' : JSON.stringify(links)
  };
  UrlFetchApp.fetch(url + port, options);
  
  console.log(JSON.stringify(links));
}