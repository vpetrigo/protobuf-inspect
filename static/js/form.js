window.onload = function () {
    var form = document.querySelector('#proto-form');
    function sendData() {
        var XHR = new XMLHttpRequest();
        var FD = new FormData(form);
        // Define what happens on successful data submission
        XHR.onload = function (event) {
            setOutput(this.responseText);
        };
        // Define what happens in case of error
        XHR.onerror = function (event) {
            alert('Oops! Something went wrong.');
        };
        // Set up our request
        XHR.open("POST", "/");
        // The data sent is what the user provided in the form
        XHR.send(FD);
    }
    form.onsubmit = function (event) {
        event.preventDefault();
        sendData();
    };
};
function setOutput(info) {
    var outputDivElement = document.getElementById("inspection-output");
    var textOutputElement = outputDivElement.getElementsByTagName("pre");
    textOutputElement.item(0).textContent = info;
    outputDivElement.style.visibility = "visible";
}
