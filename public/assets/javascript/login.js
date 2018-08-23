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

        $.get("/api/user/" + userName, function(result) {
                if ( !result ) {
                    $("#loginErrMsg").text("User not found");
                } else {
                    if ( userPwd != result.user_pwd ) {
                        $("#loginErrMsg").text("Invalid Password");
                    } else {
                        sessionStorage.setItem("userName", userName);
                        window.location.replace("team");
                    }
                }
        });
    });

});