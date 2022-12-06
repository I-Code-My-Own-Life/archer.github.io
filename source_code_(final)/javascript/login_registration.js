// Our registration values : 
let reg_email = document.getElementById("reg_email");
let reg_username = document.getElementById("reg_username");
let reg_password = document.getElementById("reg_password");
let reg_age = document.getElementById("reg_age");
let result = document.getElementById("result");
let username_exists = false;
// localStorage.clear();
// Button to register our account :
let reg_button = document.getElementById("reg_button");
                                    // Our registration functionality : 
reg_button.addEventListener("click",()=>{
    // Storing all values in a object :
    let account = {
        email:reg_email.value,
        username:reg_username.value,
        password:reg_password.value,
        age:reg_age.value,
    }
    // If the email includes "@" sign and all the entries in the form are NON-EMPTY and the username is not already taken by someone: 
    if(account.email.includes("@") && account.email != "" && account.username != "" && account.password != "" && account.age != ""){
        // Looping through every account in our localStorage and checking if the username that we entered is already taken :
        Object.keys(localStorage).forEach((key) => {
            if(JSON.parse(localStorage.getItem(key)).username.includes(account.username)){
                username_exists = true;
            }
        });
        if(!username_exists){
            // Converting it into json : 
            let accountInString = JSON.stringify(account);
            console.log(accountInString);
            // And storing them into the localStorage :
            localStorage.setItem(account.username,accountInString);
            // And then setting the form's previous values back to empty :
            reg_email.value = "";
            reg_username.value = "";
            reg_password.value = "";
            reg_age.value = "";
            result.innerHTML = "User has been added !!!"
        }
        else{
            result.innerHTML = "Username already taken !!!"
            username_exists = false;
        }
    }
})

                                    // Our login functionality : 
let log_button = document.getElementById("log_button");
let log_username = document.getElementById("log_username");
let log_password = document.getElementById("log_password"); 
let login = false;
log_button.addEventListener("click",(e)=>{
    e.preventDefault();
    let username = log_username.value;
    let password = log_password.value;
    // Looping through every account in our localStorage and checking if the username and password entered matches any other account's username and password, if it does then we will log in the person :
    Object.keys(localStorage).forEach((key) => {
        // ( if there is already an account logged In then first log out that account by setting it's loggedIn to false)
        if(JSON.parse(localStorage.getItem(key)).loggedIn == "true"){
            let obj = JSON.parse(localStorage.getItem(key))
            obj.loggedIn = "false";
            localStorage.setItem(key,JSON.stringify(obj));
        } 
        // Here, we are loggin in if username and the password matches :
        if(JSON.parse(localStorage.getItem(key)).username.includes(username) && JSON.parse(localStorage.getItem(key)).password.includes(password)){
            // First we are setting making another property in it named loggedIn and setting it to true :
            let obj = JSON.parse(localStorage.getItem(key))
            obj.loggedIn = "true";
            localStorage.setItem(key,JSON.stringify(obj));
            login = true;
        }
    });

    if(login){
        result.innerHTML = "Successfully logged in!"
        log_username.value = "";
        log_password.value = "";
        location.href = "account.html"
    }
    else{
        result.innerHTML = "Wrong Username or password !!";
        log_username.value = "";
        log_password.value = "";
    }

})

console.log(localStorage);