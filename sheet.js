function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

function main(){
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
}