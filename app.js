const githubContainer=document.querySelector(".github-main-container");
const colorMode=document.querySelector(".color_mode");
const currentState=document.querySelector("#state");
const profileSearchInput=document.querySelector("#seaarchUser");

function toggleLightAndDarkMode(){
    this.classList.toggle("active");
   //change css root variable
}

async function getListOfState(){
    const response= await fetch("./state.json");
    const jsonData= await response.json();
    displayListOfState(jsonData.states)
}

function displayListOfState(state){
      state.map(state=>{
         currentState.innerHTML+=`
         <option value=${state.name}>${state.name}</option>
         `
      }).join("");
};

getListOfState(); //list of state


let headers = new Headers({
   "Accept"       : "application/json",
   "Content-Type" : "application/json",
   "User-Agent"   : "request",
});

let location = currentState.value; //get current state from select option

    async function fetchGithubUsers(location="nigeria"){
        try{
            const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(`location:${location}`)}`,{  headers:headers,mode:'cors'
            });
        const jsonData = await response.json();
          return jsonData
        }catch(err){
             console.log(err)
        }
  }
   
  async function getGithubUserInfo(location){
    let listOfgithubProfile=await fetchGithubUsers(location);
        
     listOfgithubProfile.items.map(items=>{
        const userProfiles=items.url;
              fetch(userProfiles,{mode:"cors", headers:headers})
              .then(res => res.json())
              .then(data => displayGithubProfile(data))
              .catch(err => console.error(err));
        
     }).join("");
  }

  function displayGithubProfile(data){
     
         //loop through the user obj and check if any value is null
       for (const key in data){
           if(data[key]===null){
             //change null value to something readable
              data[key]=`No ${key} Availiable`;
           }
       };

       //user infos
       const userJoinedDate=new Date(data.created_at).getFullYear()
       const  userFollowers=data.followers;
       const userFollowing=data.following;
       const  userRepos=data.public_repos;
       const name=data.name;
       const userProfile=data.avatar_url;
       const userName=data.login;
       const userBio=data.bio;
       const userLocation=data.location
       const userTwitter=data.twitter_username;
       const userProfileLink= data.html_url;

       githubContainer.innerHTML+=`
    <div class="flex github-container" style="align-items: flex-start;">
    <img class="lg-profile profile-img" src="${userProfile}" alt="">
    <!-- github card begins -->
     <div class="github-card">
       <!--github-card-header begins  -->
        <div class="github-card-header flex">
           <img class="profile-img sm-profile" src="${userProfile}" alt="">
           <div class="github-card-desc">
              <p class="name">${name}</p>
              <p class="username">@${userName}</p>
              <p class="joined-date">Joined ${userJoinedDate}</p>
           </div>
        </div>
        <!--github-card-header ends-->
         <p class="profile-desc">${userBio} </p>
         <!-- github-status-container begins -->
         <div class="github-status-container">
            <div class="github-status-content">
               <h3>Repos</h3>
               <p class="no-repo">${userRepos}</p>
            </div>
            <div class="github-status-content">
               <h3>Followers</h3>
               <p class="no-follower">${userFollowers}</p>
            </div>
            <div class="github-status-content">
               <h3>following</h3>
               <p class="no-following">${userFollowing}</p>
            </div>
         </div>
          <!-- github-status-container ends -->
          <!-- github-contacts begins -->
         <div class="github-contacts">
            <div class="contacts flex">
               <i class="fa-solid fa-location-dot"></i>
                <p class="location">${userLocation}</p>
            </div>
            <div class="contacts flex">
               <i class="fas fa-link"></i>
                <p class="profile-linke"><a href="${userProfileLink}" target="_blank">${userProfileLink}</a></p>
            </div>
            <div class="contacts flex">
                <i class="fa-brands fa-twitter"></i>
                <p class="twitter-name">${userTwitter}</p>
            </div>
         </div>
          <!-- github-contacts ends-->
     </div>
    <!-- github card ends -->
 </div>
    `
  };

function displayGithubProfileOfCurrentSate(){
   githubContainer.innerHTML=""
     let currentLocation=this.value;
     //display github user info
      if(profileSearchInput.value===""){
         getGithubUserInfo(currentLocation);
         console.log("normal")
      }else{
           console.log("with search ")
           getGithubProfileOnSearch()
      }
 };
 
 let timeout;

 async function getGithubProfileOnSearch(){
      if(this.value!==""){
         githubContainer.innerHTML=""
         try{
            const response= await  fetch(`https://api.github.com/search/users?q=${profileSearchInput.value}+location:${currentState.value}`,{mode: 'cors',  headers:headers});
            const jsonData=await response.json()

         clearTimeout(timeout);  //clear timeout
           
          timeout = setTimeout(function () {  //allow users to finishing inputing before excuting
                 let listOfgithubProfileSearch= jsonData.items
                 
                  if(listOfgithubProfileSearch.length>0){
                       listOfgithubProfileSearch.map(listOfgithubProfileSearch=>{
                           const userProfile=listOfgithubProfileSearch.url;
                           fetch(userProfile,{mode:"cors",headers:headers})
                           .then(response=>response.json())
                           .then(userData=>displayGithubProfile(userData))
                           .catch(err=>console.log(err));
                       })
                  }
         }, 1000);
         }catch(err){
            console.log(err)
         }
      }
      else{
         getGithubUserInfo(currentState.value);
      }
  }
  
/* Events */
colorMode.addEventListener("click",toggleLightAndDarkMode);
window.addEventListener("DOMContentLoaded",getGithubUserInfo(location));
currentState.addEventListener("change",displayGithubProfileOfCurrentSate);
profileSearchInput.addEventListener("input",getGithubProfileOnSearch)