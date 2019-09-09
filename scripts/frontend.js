// an event listener is attached to the button (event lister: click, function: search)
var button = document
    .getElementById("search")
    .addEventListener("click", search);

// an empty object for the user info is declared
const userInfo = {
    userName: "",
    fullName: "",
    bio: "",
    image: "",
    publicRepos: ""
};

// a new object is declare, later this is going to be filled with objects that have info of the repos
const objects = new Object();

function search() {
    // first thing is to display the loader while the data is being fetched, so the container that holds the info is hidden
    document.getElementById("loader").style.display = "block";
    document.getElementById("container").style.display = "none";
    // then the error for when a user doesn't exist is set to display none
    document.getElementById("redBox").style.display = "none";

    // the container is cleared so when doing a following search the info displayed before disappear
    var container = document.getElementById("repo");
    container.innerHTML = "";
    // to keep the input value => declare a var that holds it
    var user = document.getElementById("value").value;
    // that var is then sent during the fetch to get the repos of the user searched

    fetch("https://api.github.com/users/" + user)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // if the response is not ok, then a error message appears
                displayError();
            }
        })
        // in that step the object created at the beginning (userInfo) is filled
        .then(json => {

            userInfo.userName = json.login;
            userInfo.fullName = json.name;
            userInfo.bio = json.bio;
            userInfo.image = json.avatar_url;
            userInfo.publicRepos = json.public_repos;

            // and then the function that does fetchs the repos is called
            // if the user has repos then the fetchRepos function is called, else a message 'No repos for this user is displayed'
            if (userInfo.publicRepos != 0) {
                fetchRepos();
            } else {
                var norepos = document.getElementById('repos').style.display = "block";
                norepos.innerHTML = "No repos for this user";
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// the div that display the error is set to display=block, before it was display=none
function displayError() {
    // to hide the info of the last research
    document.getElementById("userInfo").style.display = "none";
    document.getElementById("repos").style.display = "none";
    document.getElementById("container").style.display = "block";
    document.getElementById("loader").style.display = "none";

    //to display the error message
    document.getElementById("redBox").style.display = "block";
    document.getElementById("search-container").style.padding =
        "0px 0px 30px 0px";
}

//that function fetch the repos owned by the user
function fetchRepos() {
    var user = document.getElementById("value").value;

    fetch("https://api.github.com/users/" + user + "/repos?type=owner")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // if the response is not ok, then a error message appears
                console.log("error");
            }
        })
        .then(json => {
            // document.getElementsByClassName("loader").style.display = "none";
            document.getElementById("userInfo").style.display = "flex";
            document.getElementById("repos").style.display = "block";

            // in the foor loop the object is filled with objects each one for a repo, that contains the name, the stars and the forks
            for (var i = 0; i < json.length; i++) {
                objects[i] = {
                    name: json[i].name,
                    stars: json[i].stargazers_count,
                    forks: json[i].forks_count
                };
            }

            document.getElementById("loader").style.display = "none";
            document.getElementById("container").style.display = "block";
            fillContent();
            fillRepos();
        })
        .catch(error => {
            console.log(error);
        });
}

function fillContent() {
    //the content of the userInfo is filled
    document.getElementById("avatar").src = userInfo.image;
    document.getElementById("login").innerHTML = userInfo.userName;
    document.getElementById("fullName").innerHTML = userInfo.fullName;
    document.getElementById("bio").innerHTML = userInfo.bio;
}

function fillRepos() {
    //the content of the repositories is filled
    var container = document.getElementById("repo");

    for (var i = 0; i < Object.keys(objects).length; i++) {
        var infoRepo = document.createElement("div");
        infoRepo.setAttribute("class", "inforepo");
        container.appendChild(infoRepo);
        infoRepo.innerHTML += `<div>${objects[i].name}</div>`;
        infoRepo.innerHTML += `<div><img src="../style/star.png">${objects[i].stars}</div>`;
        infoRepo.innerHTML += `<div><img src="../style/fork.png">${objects[i].forks}</div>`;
    }
}