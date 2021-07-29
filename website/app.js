/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = "&appid=505d78857199a586d4db67fc90f5383b&units=metric";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

const userInfo = document.getElementById('userInfo');

// Event listener to add function to existing HTML DOM element
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', performAction);

/* Function called by event listener */
function performAction(event) {
    event.preventDefault();
    //get user input
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    if (zipCode !== "") {
        generateBtn.classList.remove('invalid');
        getData(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add data to POST request
                postData('/add', { temp: data.main.temp, date: newDate, content: content });
            }).then(function() {
                // call updateUI
                updateUI()
            }).catch(function(error) {
                console.log("error", error);
                alert('The zip code is invalid. Try again');
            });
        userInfo.reset();
    } else {
        generateBtn.classList.add('invalid');
    }


}

// GET route
const getData = async(baseUrl, zipCode, apiKey) => {
    const res = await fetch(`${baseUrl}?q=${zipCode}${apiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

// POST route
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

// Update user interface
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update new entry values
        if (allData.date !== undefined && allData.temp !== undefined && allData.content !== undefined) {
            document.getElementById('date').innerHTML = allData.date;
            document.getElementById('temp').innerHTML = allData.temp + ' degrees celsius';
            document.getElementById('content').innerHTML = allData.content;
        }
    } catch (error) {
        console.log("error", error);
    }
};
