$(function() {

    // variable for NFL team ID reference
    //const Tether = require("Tether");
    let teamId;
    let userName = sessionStorage.getItem("userName");
    let team = { qb: 0, rb: 0, wr: 0, te: 0, def: 0, total: 0 };
    
    if ( !userName || userName === "" ) {
        window.location.replace("/");
    }

    var isRosterPage = $("title").text().includes("Roster page");

    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* ++++++++++++++++++++++++++++  ON PAGE LOAD SPECIFIC FUNCTIONS +++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    
       
    $("team").ready(() => {
       numberOfPlayers("new", 0);
    });
    $("roster").ready(() => {
        populateUserTeam(userName);
    });
    

    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++  ON CLICK EVENT LISTENERS  ++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

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

    // TEAM BUTTON
    $(".team-btn").click(function() {
        $(".team-btn").removeClass("active");
        $(this).addClass("active");
    });

    // ADD BUTTON
    $(document).on("click", ".add-btn", function() {
        
        numberOfPlayers($(this), 1);
        addPlayer($(this).parent().parent());

        if ( isRosterPage ) { //this is the roster page

            var playerId = $(this).parent().parent().attr("value");

            var onRoster = { on_roster: true,
                            id: parseInt(playerId),
                            name: userName};
                
            $.ajax( {   url: "/userplayer",
                        method: "PUT",
                        data: onRoster } )
                .then( function(result) {
                    if (result.error) {
                        $("#saveRosterErrMsg").text(result.error);
                    }
            });
        }
    });

    // REMOVE BUTTON
    $(document).on("click", ".remove-btn", function() {

        numberOfPlayers($(this), -1);
        removePlayer($(this).parent().parent());

        if ( isRosterPage ) { //this is the roster page

            var playerId = $(this).parent().parent().attr("value");

            var onRoster = { on_roster: false,
                            id: parseInt(playerId),
                            name: userName};
            
            $.ajax( {   url: "/userplayer",
                        method: "PUT",
                        data: onRoster } )
                .then( function(result) {
                    if (result.error) {
                        $("#saveRosterErrMsg").text(result.error);
                    }
            });
        }
    });

    // INFO BUTTON
    $(document).on("click", ".info-btn", function() {
        
        $(this).popover("toggle");
        //$(this).popover();
    });


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++  ADD AND REMOVE FUNCTIONS  ++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    // ADD PLAYER FUNCTION
    const addPlayer = (card) => {
        
        card.appendTo("#team-populate")
            .find( ".add-btn" ).html("<i class='fas fa-minus'></i>")
            .addClass("remove-btn").removeClass("add-btn").removeClass("added"); 
    }

    // REMOVE PLAYER FUNCTION
    const removePlayer = (card) => {
        card.appendTo("#nfl-populate")
            .find( ".remove-btn" ).html("<i class='fas fa-plus'></i>")
            .addClass("add-btn").removeClass("remove-btn");
    }

    // NUMBER OF REQUIRED PLAYERS FUNCTION
    const numberOfPlayers = (infoTag, modifier) => {

        if(modifier === 0) {
            $(".pos").html(() => {
                return `<h5 style="color:#0B2265">Current team requirements:</h5>`
                        + `<h5 style="color:#003F2D"><strong>QB:</strong>  ${team.qb} of 1, &emsp; <strong>RB:</strong>  ${team.rb} of 2, &emsp; <strong>WR:</strong>  ${team.wr}  of 3`
                        + `<h5 style="color:#003F2D"><strong>TE:</strong>  ${team.te} of 1, &emsp; <strong>DEF:</strong>  ${team.def} of 1, &emsp; <strong>Total:</strong>  ${team.total}  of 18,</h5><br /><br /><br />`;
            });    
        } else {
            let position = $(infoTag).attr("position");
            team.total += modifier;
            switch (position) {
                case "QB":  team.qb += modifier;
                            break;

                case "RB":  team.rb += modifier;
                            break;
                
                case "WR":  team.wr += modifier;
                            break;

                case "TE":  team.te += modifier;
                            break;

                case "DEF": team.def += modifier;
                            break;
            }
           
            $(".pos").html(() => {
                return `<h5 style="color:#0B2265">Current team requirements:</h5>`
                        + `<h5 style="color:#003F2D"><strong>QB:</strong>  ${team.qb} of 1, &emsp; <strong>RB:</strong>  ${team.rb} of 2, &emsp; <strong>WR:</strong>  ${team.wr}  of 3`
                        + `<h5 style="color:#003F2D"><strong>TE:</strong>  ${team.te} of 1, &emsp; <strong>DEF:</strong>  ${team.def} of 1, &emsp; <strong>Total:</strong>  ${team.total}  of 18,</h5><br /><br /><br />`;
            });
        }
    }

    // CLEAR FUNCTIONS
    const clearNFL = () => {
        $("#nfl-populate").text("");
    }
    const clearSelection = () => {
        $("#team-populate").text("");
    } 


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++    AJAX CALLS    ++++++++++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    // NFL TEAM AJAX CALL
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
                let col1 = $("<div class='column is-3 scale-left'>");

                let playerId = element.player_id;
                let pPosition = element.player_position;
                card.attr("value", playerId);
                card.attr("position", pPosition);

                logo = $("<img src='" + element.player_imgURL + "' class='prof-logo'>");
                col1.append(logo);

                let col2 = $("<div class='column is-5 scale-center'>"),
                name = $(`<h5 class='player-info name'>${element.player_name}</h5>`);
                projected = Math.floor(Math.random() * 5) + 1;
                let proTag = $(`<h5 class="player-info">Projected points: ${projected}</h5>`);
                teamLogo = $(`<img src='/assets/img/team-logos/${element.nflteamTeamId}.svg' class='team-logo-small' />`)
                
                col2.append(name, proTag, teamLogo);

                let col3 = $("<div class='column is-4 scale-right'>"),
                position = $(`<h5 class='player-info'>${element.player_position}</h5>`),
                add = $("<button class='add-btn'>");

                add.attr("value", playerId);
                add.attr("position", pPosition);

                message = $("<h6 class='message'></h6>")
                add.append($("<i class='fas fa-plus'></i>")); 
                col3.append(position, add, message);

                card.append(col1, col2, col3);
                
                $("#nfl-populate").append(card);
                cardValue++;
            });
        })
    }

    // USER TEAM AJAX CALL
    const populateUserTeam = (userName) => {
        $.ajax({
            url: `/api/userplayers/${userName}`,
            method: "GET"
        }).then((response) => {
            response.forEach(element => {
                // create div card
                let card = $("<div class='card columns profile'>");
                // div columns
                let col1 = $("<div class='column is-3 scale-left'>");
                
                logo = $("<img src='" + element.nflplayer.player_imgURL + "' class='prof-logo'>");
                col1.append(logo);

                let col2 = $("<div class='column is-6 scale-center'>"),
                name = $(`<h5 class='player-info name'>${element.nflplayer.player_name}</h5>`);
                projected = Math.floor(Math.random() * 5) + 1,
                proTag = $(`<h5 class="player-info">Projected points: ${projected}</h5>`);
                teamLogo = $(`<img src='/assets/img/team-logos/${element.nflplayer.nflteamTeamId}.svg' 
                    class='team-logo-small' />`)

                // let info = $(`<div class='popup'>`),
                // bubble = $("<div class='popuptext linechart' id='myPopup'></h5>")
                infoBtn = $(`<button class='info-btn' data-toggle='popover' data-placement='top' 
                    data-content='data goes here' title='${element.nflplayer.player_name}'s weekly scores'
                    data-trigger='focus'>`);
                infoBtn.append($("<i class='fas fa-info'></i>"));
                // info.append(bubble);
                col2.append(name, proTag, teamLogo, infoBtn);

                let col3 = $("<div class='column is-2 scale-right'>"),
                position = $(`<h5 class='player-position'>${element.nflplayer.player_position}</h5>`),
                add = $("<button class='add-btn'>");
                add.append($("<i class='fas fa-plus'></i>")); 
                col3.append(position, add);

                card.append(col1, col2, col3);

                let playerId = element.nflplayer.player_id;
                card.attr("value", playerId);
                let pPosition = element.nflplayer.player_position;
                card.attr("position", pPosition);
                
                $("#nfl-populate").append(card);

                if ( isRosterPage && element.on_roster === true ) {
                    addPlayer(card);
                }
            });

            $("#user-team").text(`${response[0].user.userteam_name}'s players`);
            $("#current-roster").text(`${response[0].user.userteam_name}'s current roster`);
        })
    }


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++ USER TEAM DB STORAGE FUNCTION  ++++++++++++++++++++++++++++++ */
    /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

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

            switch (playerPosition) {
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
        
        // make sure we have 18 players & all the required positions are covered
        if ( (playerDataArray.length != 18) || ( qb < 1 || rb < 2 || wr < 3 || te < 1 || def < 1 ) ){
            $("#createTeamErrMsg").text("You need 18 players and at least (1)QB, (2)RB, (3)WR, (1)TE & (1)DEF to form a roster");
            return;
        }

        $.post("/userteam", {data: playerDataArray})
            .then( function(result) {
                if ( result.error ) {
                    $("#createTeamErrMsg").text(result.error);
                } else {
                    window.location.replace("roster");
                }
            });
    });
});


/**
 * let x = d3.scaleLinear().domain([-2, width]).range([0, height]);
        // orient axis
        let xAxis = d3.svg.axis().scale(x).orient("bottom"),
            yAxis = d3.svg.axis().scale(y).orient("left");
        // define lines
        let line = d3.svg.line().x((d) => { return x(d.week); })
                                .y((d) => { return y(d.scores); });

        let svg = d3.select(".linechart").append("svg")
                    .attr("width", width).attr("height", height)
                    .append("g");
        
        let data = arrData.map((d) => {
            return{
                week: arrData[0],
                scores: arrData[1]
            }
        })

        
         current = Math.floor(Math.random() * 5) + 1,
            backOne = Math.floor(Math.random() * 5) + 1,
            backTwo = Math.floor(Math.random() * 5) + 1;
 */