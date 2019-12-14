/**
* Creates the time-driven trigger
*/
function launch() {
  try {
    // Trigger every 12 hours.
    ScriptApp.newTrigger('main')
    .timeBased()
    .everyHours(12)
    .create();
  } catch(err) { console.log("Launch error: " + err); }
}

/**
* Main function that will launch all secondary functions
*/
function main() {
  try {
    const labelName = "Scrapping";
    const apecMail = "offres@diffusion.apec.fr";
    var links = new Array();
    var response = Gmail.Users.Labels.list('me');
    
    if (response.labels.length == 0) {
      Logger.log('No labels found.');
    } else {
      for (var i = 0; i < response.labels.length; i++) {
        var label = response.labels[i];
        if(label.name == labelName) {
          var messages = getMailLabel(label.name);
          messages.forEach(function(message) {
            message.forEach(function(d) {
              if(d.getFrom().toLowerCase().indexOf(apecMail) > -1) {
                if(d.isStarred() == true) {
                  getLinks(d.getBody(), links).forEach(function(item) {
                    links.push(item);
                  });
                  d.unstar();
                  d.refresh();
                }                
              }
              else {
                console.log("The mail '" + d.getSubject() + "' hadn't been send by Apec"); 
              }
            });
          });
        }
      }
      sendLinks(links);
    }
  } catch(err) { console.log("Error in Main: " + err); }
}