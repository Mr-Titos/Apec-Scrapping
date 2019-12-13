/**
 * Lists the mails in the label specified.
 */
function getMailLabel(lab) {
   
  // get all email threads that match label
  var threads = GmailApp.search("label:" + lab);
  
  // get all the messages for the current batch of threads
  return GmailApp.getMessagesForThreads(threads);
}