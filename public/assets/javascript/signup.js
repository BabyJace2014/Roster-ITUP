$(function() {

    sessionStorage.clear();
    
    $("#signUpSubmit").on("click", function(event) {
        event.preventDefault();

        $("#signupErrMsg").text("");

        var userName = $("#userName").val().trim();
        var userPwd1 = $("#userPwd1").val().trim();
        var userPwd2 = $("#userPwd2").val().trim();
        var teamName = $("#teamName").val().trim();

        if ( !userName || !userPwd1 || !userPwd2 || !teamName ) {
            $("#signupErrMsg").text("All fields are required");
            return;
        }

        if (userPwd1 != userPwd2 ) {
            $("#signupErrMsg").text("Passwords must match");
            return;
        }

        var newUser = { name: userName,
                        password: userPwd1,
                        teamname: teamName };
    
        $.post("/signup", newUser)
            .then( function(result) {
                if ( result.error ) {
                    $("#signupErrMsg").text(result.error);
                } else {
                    sessionStorage.setItem("userName", result.user_name);  
                    window.location.replace("team");
                }
        });
    });

});