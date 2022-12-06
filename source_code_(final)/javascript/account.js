 // Again we are going to loop through every object in our localStorage and check if any one of them has a property of loggedIn set to true : 
 Object.keys(localStorage).forEach((key) => {
    if(JSON.parse(localStorage.getItem(key)).loggedIn == "true"){
        let email = document.getElementById("email");
        let username = document.getElementById("username");
        let password = document.getElementById("password");
        let age = document.getElementById("age");
        // Setting the values of the input tags above to the account information in localStorage : 
        email.placeholder = JSON.parse(localStorage.getItem(key)).email;
        username.placeholder = JSON.parse(localStorage.getItem(key)).username;
        password.placeholder = JSON.parse(localStorage.getItem(key)).password;
        age.placeholder = JSON.parse(localStorage.getItem(key)).age;
   }
});