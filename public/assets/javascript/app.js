


// variable for NFL team ID reference
let teamId;

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
            let col1 = $("<div class='column is-3'>"),
            logo = $(`<img src='/assets/img/team-logos/${teamId}.svg' class='prof-logo'>`);
            col1.append(logo);

            let col2 = $("<div class='column is-5'>"),
            name = $(`<h5 class='player-info name'>${element.player_name}</h5>`);
            col2.append(name);

            let col3 = $("<div class'column is-4'>"),
            position = $(`<h5 class='player-info'>${element.player_position}</h5>`),
            add = $("<button class='add-btn'>");
            message = $("<h6 class='message'></h6>")
            add.append($("<i class='fas fa-plus'></i>")); 
            col3.append(position, add, message);

            card.append(col1, col2, col3);
            $("#nfl-populate").append(card);
            cardValue++;
        });
    })
 }

//  <div class="card profile">
//                     <div class="card-content">
//                         <div class="columns">
//                             <div class="column is-3">
//                                 <div class="prof-logo"></div>
//                             </div>
//                             <div class="column is-5">
//                                 <h5 class="player-info">Player's Name</h5>
//                             </div>
//                             <div class="column is-4">
//                                     <h5 class="player-info">Player's Position</h5>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


