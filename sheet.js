var wb = XLSX.utils.book_new();

wb.Props = {
    Title: "Apec",
    Subject: "Offres",
    Author: "Titos",
    CreatedDate: Date.now()
};

wb.SheetNames.push("Offres Sheet");
var ws_data = [['hello' , 'world']];
var ws = XLSX.utils.aoa_to_sheet(ws_data);
wb.Sheets["Offres Sheet"] = ws;


var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
