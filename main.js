'use strict'

/*
    Digest Function: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    !File Reader: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    Blob: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    Update Element By ID: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
    Input Type (File): https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
*/

function handleChooseFile() {
    
    const ALGORITHMS = { // supported values of the digest function
        "1" : "SHA-1",
        "256" : "SHA-256",
        "384" : "SHA-384",
        "512" : "SHA-512"
    };

    let files = document.getElementById("file-input").files;
    let numFiles = files.length;

    let file = null;
    let fileSize = 0;
    //let reader = null;
    let blob = null;
    let digest = 0;

    if(numFiles !== 1) { 
        console.error("Only select one file at a time (check html)");
        return; 
    } // only accept one file when this function is called

    // user uploaded file
    file = files[0];
    
    blob = new Blob([file]);

    blob.arrayBuffer()
        .then((buffer) => {
            digestWrapper("SHA-256", buffer).then((digest) => {
                let ui8a = new Uint8Array(digest);
                let hashArray = Array.from(ui8a); // convert buffer to byte array
                let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex stri

                updateElementById("file-sum", `<b>${hashHex}</b>`);
    
                const compSum = document.getElementById("comp-sum").value;
                hashHex === compSum ? 
                    updateElementById("equality-indicator", `<b>TRUE</b>`) :
                    updateElementById("equality-indicator", `<b>FALSE</b>`);
            }); 
        });

    fileSize = file.size;
    updateElementById("file-size", `<b>${fileSize}</b>`);
}

/*
    About: digest a given block of data
    Arguments:
        algorithm: defined in ALGORITHMS (DOMString)
        data: is an ArrayBuffer or ArrayBufferView containing the data to be digested
    Returns:
        Promeise which will be fulfilled with the digest
*/
function digestWrapper(algorithm, data) {
    let promise = crypto.subtle.digest(algorithm, data);
    return promise;
}

function updateElementById(id, data) {
    var elem = document.getElementById(id);
    elem.innerHTML = data;
}