document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btnExport');
    const btnCopy = document.getElementById('btnCopy');

    //Disables the copy btn because there is no text in output
    btnCopy.disabled = true;

    //Executes when export is clicked
    btnExport.addEventListener('click', () => {
        //Gets the active tab(hopefully chatgpt tab)

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            //checks if tab is there
            if (tabs.length > 0) {

                //gets the tab id
                const tabId = tabs[0].id;

                //This executes the js on the page rather than the extension
                chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    func: () => {
                        let allPrompts = "This is a list of all your ChatGPT prompts from this conversation\n\n";

                        // Collect all ChatGPT prompts
                        const prompts = document.getElementsByClassName("whitespace-pre-wrap");
                        // loops through prompts and adds them to string output 
                        for (let prompt of prompts) {
                            allPrompts += prompt.innerText + "\n\n";
                        }
                        //returns the string output
                        return allPrompts;
                    },
                }, (results) => {
                    // handles the result of the above function
                    //checks if there is a result
                    if (results && results[0]?.result) {
                        //sets the output to the result
                        document.getElementById('output').innerHTML = results[0].result;
                        btnCopy.disabled = false;

                    } else {
                        console.error("Failed to fetch prompts.");
                    }
                });
            } else {
                console.error("No active tab found.");
            }
        });
    });

    //executes when copy is clicked
    btnCopy.addEventListener('click', async () => {

        var output = document.getElementById('output');
        try {
            //Copues the output to clipboard
            await navigator.clipboard.writeText(output.innerText);
            console.log('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });


});
