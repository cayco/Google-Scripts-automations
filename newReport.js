function onOpen() {
  getFiles(folderId);
}


/** 
 * Creates new report file from the old report with next Friday's date in the name field.
 * Krzysztof Kajkowski
 * 08.10.2017
*/

// Folder with repert files
var folderId = 'XXXXYYYYZZZ';
// Report day of the week. 5 is Friday
var reportDay = 5;


// =================
// main function
function getFiles(folderId) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);
        
    Logger.log("Processing folder: "+parentFolder.getName());
    // Get newest file in the report folder
    var oldReportFile = DriveApp.getFileById(getNewestFileInFolder(parentFolder.getName()));
    var newReportDate = new Date();
    // Get next Friday's date
    newReportDate.setDate(setDay(new Date(), reportDay).getDate());
    Logger.log(newReportDate.getDate().toString());
    // Format the date
    var formattedDate = Utilities.formatDate(newReportDate, 'America/Los_Angeles', 'yyyy-MM-dd');
    Logger.log(formattedDate);
    
    // Create new report file from the old report with next Friday's date in the name field
    var newReportFile = oldReportFile.makeCopy("Projects report "+formattedDate.toString(), parentFolder);
    
  } catch (e) {
    Logger.log(e.toString());
  }
};

function getNewestFileInFolder(folderName) {
  var arryFileDates,file,fileDate,files,folder,folders,
      newestDate,newestFileID,objFilesByDate;

  folders = DriveApp.getFoldersByName(folderName);  
  arryFileDates = [];
  objFilesByDate = {};

  while (folders.hasNext()) {
    folder = folders.next();

    files = folder.getFilesByType("application/vnd.google-apps.document");
    fileDate = "";

    while (files.hasNext()) {
      file = files.next();
 /*     Logger.log('xxxx: file data: ' + file.getLastUpdated());
      Logger.log('xxxx: file name: ' + file.getName());
      Logger.log('xxxx: mime type: ' + file.getMimeType())
      Logger.log(" ");
*/
      fileDate = file.getLastUpdated();
      objFilesByDate[fileDate] = file.getId(); //Create an object of file names by file ID

      arryFileDates.push(file.getLastUpdated());
    }
    arryFileDates.sort(function(a,b){return b-a});

//    Logger.log(arryFileDates);

    newestDate = arryFileDates[0];
    Logger.log('Newest date is: ' + newestDate);

    newestFileID = objFilesByDate[newestDate];

    Logger.log('newestFile: ' + newestFileID);
    return newestFileID;
    }
}

function setDay(date, dayOfWeek) {
  date = new Date(date.getTime ());
  date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
  return date;
}
