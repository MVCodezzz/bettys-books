// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Middleware function to check if the user is logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

// router.get('/weather', function(req, res, next) {
//     let apiKey = '5aee8d9f7ab7cb3292d0b677aea4f73f';
//     let city = req.query.city || 'london'; // Default to 'london' if no city is provided
//     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                 
//     request(url, function (err, response, body) {
//         if (err) {
//             next(err);
//         } else {
//             var weather = JSON.parse(body);
//             if (weather !== undefined && weather.main !== undefined) {
//                 var wmsg = 'It is ' + weather.main.temp + ' degrees in ' + weather.name + '! <br> The humidity now is: ' + weather.main.humidity;
//                 wmsg += '<br><br><button onclick="window.location.href=\'/\'">Go Back</button>';
//                 res.send(wmsg);
//             } else {
//                 res.send("No data found");
//             }
//         } 
//     });
// });

// Route to get weather information and serve the form
router.get('/weather', function(req, res, next) {
    let apiKey = '5aee8d9f7ab7cb3292d0b677aea4f73f';
    let city = req.query.city || 'london'; // Default to 'london' if no city is provided
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                 
    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);
            let wmsg;
            if (weather !== undefined && weather.main !== undefined) {
                wmsg = 'It is ' + weather.main.temp + ' degrees in ' + weather.name + '! <br> The humidity now is: ' + weather.main.humidity;
            } else {
                wmsg = "No data found";
            }
            wmsg += `
                <br><br>
                <form action="/weather" method="get">
                    <label for="city">Enter city:</label>
                    <input type="text" id="city" name="city">
                    <button type="submit">Get Weather</button>
                </form>
                <br><br>
                <button onclick="window.location.href='/'">Go Back</button>
            `;
            res.send(wmsg);
        } 
    });
});


// Export the router object so index.js can access it
module.exports = router;
