window.onload = function () {
    const form: HTMLFormElement = document.querySelector('#proto-form');

    function sendData() {
        const XHR = new XMLHttpRequest();
        const FD = new FormData(form);
        // Define what happens on successful data submission
        XHR.onload = function (event: ProgressEvent) {
            if (this.status == 200) {
                setOutput(this.responseText);
            }
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

    form.onsubmit = function (event: Event) {
        event.preventDefault();
        sendData();
    };
}

function setOutput(info: string) {
    let outputDivElement = document.getElementById("inspection-output");
    let textOutputElement = outputDivElement.getElementsByTagName("pre");

    textOutputElement.item(0).textContent = info;
    outputDivElement.style.visibility = "visible";
}
