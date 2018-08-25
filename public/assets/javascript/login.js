$(function() {

    sessionStorage.clear();
    
    $("#loginSubmit").on("click", function(event) {
        event.preventDefault();

        $("#loginErrMsg").text("");

        var userName = $("#userName").val().trim();
        var userPwd = $("#userPwd").val().trim();

        if ( !userName || !userPwd ) {
            $("#loginErrMsg").text("Both fields are required");
            return;
        }

        // check that the user exists
        $.get("/api/user/" + userName, function(result) {
            if ( !result ) {
                $("#loginErrMsg").text("User not found");
            } else {
                // check that passwords match
                if ( userPwd != result.user_pwd ) {
                    $("#loginErrMsg").text("Invalid Password");
                } else {
                    sessionStorage.setItem("userName", userName);

                    // check if the user's team has already been defined
                    $.get("/api/userplayers/" + userName, function(data) {

                        // if they haven't defined a team, send them to the team creation page
                        if ( !data.length ) {
                            window.location.replace("team");
                        } else {    // if they have a team, send them to the roster creation page
                            window.location.replace("roster");
                        }
                    });
                }
            }
        });
    });

});