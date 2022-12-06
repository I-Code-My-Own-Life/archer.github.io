console.log(localStorage);
let tobody = document.getElementById("tobody");
let i = 1;
// Looping through every account in localStorage and displaying it's score, name and other information : 
Object.keys(localStorage).forEach((key) => {
    // Displaying the information on the leaderboard : 
    tobody.innerHTML += `
    <tr>
    <td>${i}</td>
    <td>${JSON.parse(localStorage.getItem(key)).username}</td>
    <td>${JSON.parse(localStorage.getItem(key)).stars}</td>
    <td>${JSON.parse(localStorage.getItem(key)).time}</td>
    </tr>`
    i++;
});


{/* <tr>
  <td>1st</td>
  <td>Chipmunk</td>
  <td>9850</td>
  <td>4mins 23secs</td>
</tr> */}