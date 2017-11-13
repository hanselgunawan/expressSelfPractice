let RPS = {
    user_id:0,
    databaseTurn:0,
    player_rps_choice: "",
    opponent_rps_choice: "",
    player_win:0,
    player_lose:0,
    player_name: "",
    opponent_name: "",
    opponent_win:0,
    opponent_lose:0,
    showScoreTimeout:0,
    isGameEnds: false,
    player: {
        player_id:1,
        player_name: '',
        player_wins: 0,
        player_losses: 0,
        player_turns: 0,
        player_choice: ''
    },
    opponent: {
        opponent_id:2,
        opponent_name: '',
        opponent_wins: 0,
        opponent_losses: 0,
        opponent_turns: 0,
        opponent_choice: ''
    },
    initializeFirebase:function () {
        const config = {
            apiKey: "AIzaSyCqQegmCWlWxRucjKqP2-8cXZYOHprbJsc",
            authDomain: "rps-game-4b0f0.firebaseapp.com",
            databaseURL: "https://rps-game-4b0f0.firebaseio.com",
            projectId: "rps-game-4b0f0",
            storageBucket: "rps-game-4b0f0.appspot.com",
            messagingSenderId: "441313473203"
        };
        firebase.initializeApp(config);
    },
    playerDisconnect:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        ref.on("value", function (snapshot) {
            if(RPS.user_id !== 0)
            {
                if(snapshot.child(1).exists() && RPS.user_id === snapshot.child(1).val().player_id)
                {
                    if(RPS.user_id !== 0)
                    {
                        database.ref("chat").onDisconnect().update({
                            message: "<span style='text-transform: capitalize'>" + snapshot.child(1).val().player_name + "</span> has disconnected!"
                        });
                    }
                    database.ref("players/1").onDisconnect().remove();
                }
                else if(snapshot.child(2).exists() && RPS.user_id === snapshot.child(2).val().opponent_id)
                {
                    database.ref("chat").onDisconnect().update({
                        message: "<span style='text-transform: capitalize'>" + snapshot.child(2).val().opponent_name + "</span> has disconnected!"
                    });
                    database.ref("players/2").onDisconnect().remove();
                    database.ref("players/turn").onDisconnect().remove();
                }
                else if(!snapshot.child(1).exists() && !snapshot.child(2).exists())
                {
                    database.ref("chat").onDisconnect().update({
                        message: ""
                    });
                }
            }
        });
    },
    resetTurn:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        RPS.databaseTurn = 1;
        RPS.isGameEnds = false;
        ref.update({
            turn:RPS.databaseTurn
        });
    },
    displayGame:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        ref.on('value', function (snapshot) {
            let newRefPlayer, newRefOpponent;
            ref.on('value', function (snapshot) {
                if(!snapshot.hasChild("1") && !snapshot.hasChild("2"))
                {
                    if(RPS.user_id === 0)
                    {
                        $(".waiting-player").html("Waiting for player 1...");
                        $(".waiting-opponent").html("Waiting for player 2...");
                        $(".player-scores").hide();
                        $(".opponent-scores").hide();
                        $(".chat-text-container").empty();
                        $(".loading-img-player").show();
                        $(".loading-img-opponent").show();
                    }
                }
                else if(snapshot.hasChild("1") && !snapshot.hasChild("2"))
                {
                    newRefPlayer = ref.child(1);
                    newRefPlayer.on("value", function(snapshot) {
                        if(RPS.user_id === snapshot.val().player_id)
                        {
                            $("#you-are-message-player").html("welcome, " + snapshot.val().player_name + "!");
                            $(".info-opponent").hide();
                            $(".waiting-opponent").html("Waiting for player 2...");
                            $(".opponent-scores").hide();
                            $(".player-choices-list").hide();
                        }
                        $(".waiting-player").html(snapshot.val().player_name);
                        $(".player-scores").show();
                        $(".loading-img-player").show();
                        $(".loading-img-opponent").show();
                        $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
                    }, function(errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });
                    if(RPS.user_id === snapshot.child(1).val().player_id)
                    {
                        $(".rps-form").hide();
                        $("#you-are-message").show();
                    }
                    else
                    {
                        $(".rps-form").show();
                        $("#you-are-message").hide();
                        $(".chat-text").empty();
                    }
                    RPS.playerDisconnect();
                }
                else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
                {
                    newRefOpponent = ref.child(2);
                    newRefOpponent.on("value", function(snapshot) {
                        if(RPS.user_id === snapshot.val().opponent_id)
                        {
                            $("#you-are-message-opponent").html("welcome, " + snapshot.val().opponent_name + "!");
                            $(".info-player").hide();
                            ref.on("value", function (snap) {
                                if(snap.numChildren() < 3)
                                {
                                    $(".waiting-player").html("Waiting for player 1...");
                                }
                            });
                            $(".player-scores").hide();
                            $(".opponent-choices-list").hide();
                        }
                        $(".loading-img-player").show();
                        $(".loading-img-opponent").show();
                        $(".waiting-opponent").html(snapshot.val().opponent_name);
                        $(".opponent-scores").html("Wins: <span id='player-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().opponent_losses + "</span>");
                    }, function(errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });
                    RPS.playerDisconnect();
                }
                else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
                {
                    newRefPlayer = ref.child(1);
                    newRefOpponent = ref.child(2);
                    newRefPlayer.on("value", function(snapshot) {
                        if(RPS.user_id === snapshot.val().player_id)
                        {
                            $("#you-are-message-player").html("welcome, " + snapshot.val().player_name + "!");
                            $(".waiting-player").html(snapshot.val().player_name);
                        }
                    }, function(errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });
                    newRefOpponent.on("value", function(snapshot) {
                        if(RPS.user_id === snapshot.val().opponent_id)
                        {
                            $("#you-are-message-opponent").html("welcome, " + snapshot.val().opponent_name + "!");
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                        }
                    }, function(errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });
                    $(".opponent-scores").show();
                    $(".player-scores").show();
                    $(".loading-img-player").hide();
                    $(".loading-img-opponent").hide();
                    RPS.databaseTurn = snapshot.val().turn;
                    $(".rps-form").hide();
                    RPS.playerDisconnect();

                    //Browser = Player 1, Turn = Player 1
                    if(RPS.user_id === snapshot.child(1).val().player_id && RPS.databaseTurn === 1)
                    {
                        newRefPlayer = ref.child(1);
                        $(".player-choices-list").show();
                        $(".info-player").hide();
                        $(".rps-opponent").hide();
                        $(".info-opponent").show();
                        newRefPlayer.on("value", function (snapshot) {
                            $(".info-player").html(snapshot.val().player_choice);
                            $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
                        });
                        newRefPlayer = ref.child(2);
                        newRefPlayer.on("value", function (snapshot) {
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                            $(".info-opponent").html("<span style='text-transform: capitalize'>" + snapshot.val().opponent_name + "</span> is waiting for your turn...");
                            $(".opponent-scores").html("Wins: <span id='opponent-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='opponent-loses'>" + snapshot.val().opponent_losses + "</span>");
                        });
                    }
                    else if(RPS.user_id === snapshot.child(1).val().player_id && RPS.databaseTurn === 2)//Browser = Player 1, Turn = Player 2
                    {
                        newRefPlayer = ref.child(1);
                        $(".player-choices-list").hide();
                        $(".info-player").show();
                        $(".info-opponent").show();
                        newRefPlayer.on("value", function (snapshot) {
                            $(".info-player").html(snapshot.val().player_choice);
                            $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
                        });
                        newRefOpponent = ref.child(2);
                        newRefOpponent.on("value", function (snapshot) {
                            console.log(snapshot.val().opponent_name);
                            $(".info-opponent").html("<span style='text-transform: capitalize'>" + snapshot.val().opponent_name + "</span> is choosing...");
                            $(".opponent-scores").html("Wins: <span id='opponent-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='opponent-loses'>" + snapshot.val().opponent_losses + "</span>");
                        });
                    }
                    else if(RPS.user_id === snapshot.child(2).val().opponent_id && RPS.databaseTurn === 1)//Browser = Player 2, Turn = Player 1
                    {
                        newRefPlayer = ref.child(1);
                        newRefPlayer.on("value", function (snapshot) {
                            $(".info-player").show();
                            $(".info-player").html("<span style='text-transform: capitalize'>" + snapshot.val().player_name + "</span> is choosing...");
                            $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
                            $(".opponent-choices-list").hide();
                            $(".loading-img-opponent").show();
                        });
                        newRefOpponent = ref.child(2);
                        newRefOpponent.on("value", function (snapshot) {
                            $(".opponent-scores").html("Wins: <span id='opponent-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='opponent-loses'>" + snapshot.val().opponent_losses + "</span>");
                        });
                    }
                    else if(RPS.user_id === snapshot.child(2).val().opponent_id && RPS.databaseTurn === 2)//Browser = Player 2, Turn = Player 2
                    {
                        $(".player-choices-list").hide();
                        $(".info-player").show();
                        $(".info-player").html("Done choosing");
                        $(".opponent-choices-list").show();
                        $(".loading-img").hide();
                        newRefPlayer = ref.child(1);
                        newRefPlayer.on("value", function (snapshot) {
                            $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
                        });
                        newRefOpponent = ref.child(2);
                        newRefOpponent.on("value", function (snapshot) {
                            console.log(snapshot.val().opponent_name);
                            //$(".waiting-opponent").html(snapshot.val().opponent_name);
                            $(".opponent-scores").html("Wins: <span id='opponent-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='opponent-loses'>" + snapshot.val().opponent_losses + "</span>");
                        });
                    }
                    else if(RPS.databaseTurn === 3 && RPS.isGameEnds === false)
                    {
                        RPS.isGameEnds = true;
                        $(".player-choices-list").hide();
                        $(".opponent-choices-list").hide();
                        $(".win-lose-message").show();

                        newRefPlayer = ref.child(1);
                        newRefPlayer.on("value", function (snapshot) {
                            RPS.player_rps_choice = snapshot.val().player_choice;
                            RPS.player_win = snapshot.val().player_wins;
                            RPS.player_lose = snapshot.val().player_losses;
                        });

                        newRefOpponent = ref.child(2);
                        newRefOpponent.on("value", function (snapshot) {
                            RPS.opponent_rps_choice = snapshot.val().opponent_choice;
                            RPS.opponent_win = snapshot.val().opponent_wins;
                            RPS.opponent_lose = snapshot.val().opponent_losses;
                        });

                        newRefPlayer.on("value", function (snapshot) {
                            if(RPS.user_id === snapshot.val().player_id)
                            {
                                $(".waiting-player").html(snapshot.val().player_name);
                                $(".info-opponent").hide();
                                $(".rps-opponent").show();
                                $(".rps-opponent").html(RPS.opponent_rps_choice);
                                $(".info-player").show();
                                $(".info-player").html(RPS.player_rps_choice);
                            }
                        });

                        newRefOpponent.on("value", function (snapshot) {
                            if(RPS.user_id === snapshot.val().opponent_id)
                            {
                                $(".info-opponent").show();
                                $(".info-opponent").html(RPS.opponent_rps_choice);
                                $(".info-player").show();
                                $(".info-player").html(RPS.player_rps_choice);
                                $(".loading-img").hide();
                            }
                        });

                        RPS.checkWinner();

                        RPS.showScoreTimeout = setTimeout(function () {
                            clearTimeout(RPS.showScoreTimeout);
                            newRefPlayer.on("value", function (snapshot) {
                                if(RPS.user_id === snapshot.val().player_id)
                                {
                                    $(".info-player").hide();
                                    $(".player-choices-list").show();
                                }
                            });
                            newRefOpponent.on("value", function (snapshot) {
                                if(RPS.user_id === snapshot.val().opponent_id)
                                {
                                    $(".rps-opponent").hide();
                                    $(".info-player").show();
                                    $(".info-opponent").hide();
                                }
                            });
                            $(".win-lose-message").hide();
                            RPS.resetTurn();
                        },3000);
                    }
                }
            });
        });
    },
    checkWinner:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRefPlayer = ref.child(1);
        let newRefOpponent = ref.child(2);

        if(this.player_rps_choice === "rock" && this.opponent_rps_choice === "scissors")
        {
            this.player_win++;
            this.opponent_lose++;
            this.playerWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === "rock" && this.opponent_rps_choice === "paper")
        {
            this.player_lose++;
            this.opponent_win++;
            this.opponentWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === "paper" && this.opponent_rps_choice === "rock")
        {
            this.player_win++;
            this.opponent_lose++;
            this.playerWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === "paper" && this.opponent_rps_choice === "scissors")
        {
            this.player_lose++;
            this.opponent_win++;
            this.opponentWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === "scissors" && this.opponent_rps_choice === "paper")
        {
            this.player_win++;
            this.opponent_lose++;
            this.playerWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === "scissors" && this.opponent_rps_choice === "rock")
        {
            this.player_lose++;
            this.opponent_win++;
            this.opponentWins();
            this.updateScore();
        }
        else if(this.player_rps_choice === this.opponent_rps_choice)
        {
            this.gameTies();
        }
    },
    pushToDb:function (user_input_name) {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRef;
        let user_name = user_input_name;
        ref.once('value', function (snapshot) {
            if(!(snapshot.hasChild("1")) && !(snapshot.hasChild("2")))
            {
                RPS.player.player_name = user_name;
                newRef = ref.child(1);
                newRef.set(RPS.player);
                newRef.on("value", function (snapshot) {
                   RPS.player_name = snapshot.val().player_name
                });
                RPS.user_id = 1;
                $(".rps-form").hide();
            }
            else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                alert("ROOM IS FULL!");
            }
            else if(snapshot.hasChild("1") && !snapshot.hasChild("2"))
            {
                RPS.opponent.opponent_name = user_name;
                newRef = ref.child(2);
                newRef.set(RPS.opponent);
                newRef.on("value", function (snapshot) {
                    RPS.opponent_name = snapshot.val().opponent_name
                });
                ref.update({
                    turn: 1
                });
                RPS.user_id = 2;
                ref.on("value", function(snapshot) {
                    RPS.databaseTurn = snapshot.val().turn;
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                $(".rps-form").hide();
            }
            else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                RPS.player.player_name = user_name;
                newRef = ref.child(1);
                newRef.set(RPS.player);
                newRef.on("value", function (snapshot) {
                    RPS.player_name = snapshot.val().player_name
                });
                RPS.user_id = 1;
                $(".rps-form").hide();
            }
        });
    },
    updatePlayerChoice:function (playerChoice) {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRef;
        newRef = ref.child(1);
        newRef.update({
            player_choice:playerChoice
        });

        RPS.databaseTurn++;
        ref.update({
           turn:RPS.databaseTurn
        });
    },
    updateOpponentChoice:function (opponentChoice) {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRef;
        newRef = ref.child(2);
        newRef.update({
            opponent_choice:opponentChoice
        });

        RPS.databaseTurn++;
        ref.update({
            turn:RPS.databaseTurn
        });
    },
    playerWins:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRefPlayer = ref.child(1);
        let newRefOpponent = ref.child(2);
        newRefPlayer.on("value", function (snapshot) {
            if(RPS.user_id === snapshot.val().player_id)
            {
                $(".info-player").show();
                $(".info-player").html(snapshot.val().player_choice);
                $(".win-lose-message").html("You Win!");
            }
        });
        newRefOpponent.on("value", function (snapshot) {
            if(RPS.user_id === snapshot.val().opponent_id)
            {
                $(".win-lose-message").html("You Lose!");
            }
        });
    },
    opponentWins:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRefPlayer = ref.child(1);
        let newRefOpponent = ref.child(2);
        newRefPlayer.on("value", function (snapshot) {
            if(RPS.user_id === snapshot.val().player_id)
            {
                $(".win-lose-message").html("You Lose!");
            }
        });
        newRefOpponent.on("value", function (snapshot) {
            if(RPS.user_id === snapshot.val().opponent_id)
            {
                $(".win-lose-message").html("You Win!");
            }
        });
    },
    gameTies:function () {
        $(".win-lose-message").html("It's a Tie!");
    },
    updateScore:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRefPlayer = ref.child(1);
        let newRefOpponent = ref.child(2);
        newRefPlayer.update({
            player_wins:RPS.player_win,
            player_losses:RPS.player_lose
        });
        newRefOpponent.update({
            opponent_wins:RPS.opponent_win,
            opponent_losses:RPS.opponent_lose
        });
        newRefPlayer.on("value", function (snapshot) {
            $(".player-scores").html("Wins: <span id='player-wins'>" + snapshot.val().player_wins + "</span> - Loses: <span id='player-loses'>" + snapshot.val().player_losses + "</span>");
        });
        newRefOpponent.on("value", function (snapshot) {
            $(".opponent-scores").html("Wins: <span id='opponent-wins'>" + snapshot.val().opponent_wins + "</span> - Loses: <span id='opponent-loses'>" + snapshot.val().opponent_losses + "</span>");
        });
    }
};

$(document).ready(function() {
    RPS.initializeFirebase();
    RPS.displayGame();

    let database = firebase.database();
    let refChat = database.ref("chat");
    let refPlayer = database.ref("players").child(1);
    let refOpponent = database.ref("players").child(2);

    $(".player-choices-list").hide();
    $(".opponent-choices-list").hide();
    $(".info-player").hide();
    $(".info-opponent").hide();
    $(".rps-opponent").hide();
    $(".loading-img-player").hide();
    $(".loading-img-opponent").hide();

    $("#submitName").on("click", function (event) {
        let name = $("#userName").val();
        event.preventDefault();
        RPS.pushToDb(name);
        RPS.displayGame();
    });

    $(".player-choice").on("click", function (event) {
        RPS.updatePlayerChoice($(event.target).text());
        RPS.displayGame();
    });

    $(".opponent-choice").on("click", function (event) {
        RPS.updateOpponentChoice($(event.target).text());
        RPS.displayGame();
    });

    $(".btnSubmit").on("click", function (event) {
        event.preventDefault();
        let user_message;
        if(RPS.user_id === 1)
        {
            user_message ="<span class='chat-player'>" + RPS.player_name + ":</span> " + $(".chat-input-text").val().trim();
        }
        else if(RPS.user_id === 1)
        {
            user_message ="<span class='chat-player'>" + RPS.player_name + ":</span> " + $(".chat-input-text").val().trim();
        }
        else if(RPS.user_id === 2)
        {
            user_message ="<span class='chat-opponent'>" + RPS.opponent_name + ":</span> " + $(".chat-input-text").val().trim();
        }
        let refChat = database.ref("chat");
        console.log(user_message);
        refChat.update({
           message: user_message
        });
        $(".chat-input-text").val("");
    });

    refChat.on("value", function (snapshot) {
        $(".chat-text-container").append("<p class='chat-text'>" + snapshot.val().message + "</p>");
    });
});