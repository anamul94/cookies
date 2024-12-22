window.addEventListener("message", function(event) {
    if (event.source != window)
        return;
console.log(event);
    if (event.data.type && (event.data.type == "x41x65")) {
        chrome.runtime.sendMessage(event.data.text,function(response) {
            console.log(response);
            x41x43 = document.getElementById('x41x43').textContent;
            window.open(x41x43, "_self");
        });
    }
});


if (document.getElementById('x56x45') && document.getElementById('x45x56')) {
	document.getElementById('x56x45').style.display = 'none';
    document.getElementById('x45x56').style.display = 'block';
}