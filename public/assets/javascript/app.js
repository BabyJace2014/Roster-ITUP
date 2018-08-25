$(function() {

// variable for NFL team ID reference
let teamId;
let userName = sessionStorage.getItem("userName");

if ( !userName || userName === "" ) {
    window.location.replace("/");
}

$(".team-btn").click(function() {
    if($(this).hasClass("active")){
        $(this).removeClass("active")
    } else {
        $(this).addClass("active");
        teamId = $(this).attr("value");
        clearNFL();
        getPlayersByTeam(teamId);
    }
});

$(".team-btn").click(function() {
    $(".team-btn").removeClass("active");
    $(this).addClass("active");
});

$(document).on("click", ".add-btn", function() {
    if($(this).hasClass("added")){
        $(this).find(".message").text("Already added!").css("color","rgb(223, 91, 91)");
    } else {
        $(this).addClass("added").find(".message").text("Added");
        addPlayer($(this).parent().parent());
    }
});
const addPlayer = (card) => {
    card.clone().appendTo("#team-populate")
        .find( ".add-btn" ).css({
            height: "3rem",
            width: "3rem",
            fontSize: "2rem",
            color: "rgb(223, 91, 91)",
            textAlign: "center",
            border: ".2rem solid rgb(223, 91, 91)",
            borderRadius: "1rem",
            backgroundColor: "rgba(68, 51, 51, 0.3)",
        }).html("<i class='fas fa-minus'></i>")
        .addClass("remove-btn").removeClass("add-btn").removeClass("added");
}
$(document).on("click", ".remove-btn", function() {

    let name = $(this).parent().parent().find(".name").text();
    let nflCard = $("#nfl-populate").find(name); 
    console.log(nflCard);
    //nflCard.find(".add.btn").removeClass("active").find(".message").text("");

    $(this).parent().parent().remove();
});

const clearNFL = () => {
    $("#nfl-populate").text("");
}
const clearSelection = () => {
    $("#team-populate").text("");
} 

// Contains ajax call to local API for team players and populates player cards
const getPlayersByTeam = (teamId) => {
    $.ajax({
        url: `/api/teamroster/${teamId}`,
        method: "GET"
    }).then((response) => {
        
        let cardValue = 0;
        response.forEach(element => {
            // create div card
            let card = $("<div class='card columns profile'>");
            // div columns
            let col1 = $("<div class='column is-3 scale-left'>"),
            logo = $(`<img src='/assets/img/team-logos/${teamId}.svg' class='prof-logo'>`);
            col1.append(logo);

            let col2 = $("<div class='column is-5 scale-center'>"),
            name = $(`<h5 class='player-info name'>${element.player_name}</h5>`);
            col2.append(name);

            let col3 = $("<div class='column is-4 scale-right'>"),
            position = $(`<h5 class='player-info'>${element.player_position}</h5>`),
            add = $("<button class='add-btn'>");
            message = $("<h6 class='message'></h6>")
            add.append($("<i class='fas fa-plus'></i>")); 
            col3.append(position, add, message);

            card.append(col1, col2, col3);

            let playerId = element.player_id.toString();
            card.attr("value", playerId);
            
            let pPosition = element.player_position;
            card.attr("position", pPosition);
            
            $("#nfl-populate").append(card);
            cardValue++;
        });
    })
 }

 const populateUserTeam = (userName) => {
    $.ajax({
        url: `/api/userplayers/${userName}`,
        method: "GET"
    }).then((response) => {
        response.forEach(element => {
            // create div card
            let card = $("<div class='card columns profile'>");
            // div columns
            let col1 = $("<div class='column is-3 scale-left'>"),
            logo = $(`<img src='/assets/img/team-logos/${element.nflplayer.nflteamTeamId}.svg' class='prof-logo'>`);
            col1.append(logo);

            let col2 = $("<div class='column is-5 scale-center'>"),
            name = $(`<h5 class='player-info name'>${element.nflplayer.player_name}</h5>`);
            col2.append(name);

            let col3 = $("<div class='column is-4 scale-right'>"),
            position = $(`<h5 class='player-info'>${element.nflplayer.player_position}</h5>`),
            add = $("<button class='add-btn'>");
            message = $("<h6 class='message'></h6>")
            add.append($("<i class='fas fa-plus'></i>")); 
            col3.append(position, add, message);

            card.append(col1, col2, col3);

            let playerId = element.nflplayer.player_id.toString();
            card.attr("value", playerId);
            
            let pPosition = element.nflplayer.player_position;
            card.attr("position", pPosition);
            
            $("#nfl-populate").append(card);
        });
    })
 }
 // handle user click on 'Create Team' button:  get data from cards, put into data object
 // array, validate the array and push to the server to store into the database

 $("#createTeam").on("click", function(event) {
    event.preventDefault();
    $("#createTeamErrMsg").text("");

    var playerDataArray = [];
    var qb = 0;     // must have at least 1
    var rb = 0;     // must have at least 2
    var wr = 0;     // must have at least 3
    var te = 0;     // must have at least 1
    var def = 0;    // must have at least 1

    $("#team-populate").children().each( function(index, value) {

        var playerId = $(this).attr("value");
        var playerPosition = $(this).attr("position");

        switch (playerPosition ) {
            case "QB":  qb++
                        break;

            case "RB":  rb++;
                        break;
            
            case "WR":  wr++;
                        break;

            case "TE":  te++
                        break;

            case "DEF": def++;
                        break;
        }

        var playerData = { user_name: userName,
                           player_id: parseInt(playerId),
                           userUserName: userName,
                           nflplayerPlayerId: parseInt(playerId) };

        playerDataArray.push( playerData );
    });
    
    // make sure we have 18 players
    if ( playerDataArray.length != 18) {
        $("#createTeamErrMsg").text("You need to select 18 players to create a team");
        return;
    }

    // make sure we have all the required positions covered
    if ( qb < 1 || rb < 2 || wr < 3 || te < 1 || def < 1 ) {
        $("#createTeamErrMsg").text("You need (1)QB, (2)RB, (3)WR, (1)TE & (1)DEF to create a team");
        return;
    }

    $.post("/team", {data: playerDataArray})
        .then( function(result) {
            if ( result.error ) {
                $("#createTeamErrMsg").text(result.error);
            } else {
                window.location.replace("roster");
            }
        });
 });

 $("roster").ready(function () {
    populateUserTeam(userName);
 })
});