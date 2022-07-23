colors = ["yellow", "blue", "red", "green"];
types = [1, 3, 4, 5, 6, 7, 8, 9, "changesDirection", "2plush", "stop", "taki"];
var tmpColor = "";//global variable, we use him when change color card picked
var player1 = new Player("first");//player number one gets the name of the div
var player2 = new Player("second");//player number two gets the name of the div
var checkTaki = false;//boolean variable checking if we are in taki ocassion
var cashier;
var tableDeck;
var checkTurn = 2;

//player object
function Player(name) {
    this.arr = [];//the array of cards
    this.name = name;//the name of the div
    this.insert = function (card) {
        this.arr.push(card);
    }//insert card to the array of the player
    this.remove = function (card) {
        var index = this.arr.indexOf(card);
        this.arr.splice(index, 1);
        return card;
    }//remove the card from the array of the player
    this.render = function () {
        var str = "";
        if (name == "first") {
            for (var i = 0; i < this.arr.length; i++) {
                str += renderCard(this.arr[i]);
            }
        }

        else {
            for (var i = 0; i < this.arr.length; i++) {
                str += renderBackCard(this.arr[i]);
            }
        }

        //Save the position to local storage
        localStorage.setItem(this.name, JSON.stringify(this.arr));
        localStorage.setItem("tableDeck", JSON.stringify(tableDeck));
        localStorage.setItem("cashier", JSON.stringify(cashier));
        localStorage.setItem("turn", JSON.stringify(checkTurn));
        return str;
    }//show the cards of the player
    this.search = function (type, color) {
        for (var i = 0; i < this.arr.length; i++) {
            if (type == this.arr[i].type && color == this.arr[i].color) {
                return i;
            }
        }
        return null;
    }//search the card in the array of cards
    this.makeDisableTrue = function (imgPlayer) {
        for (var i = 0; i < imgPlayer.length; i++) {
            imgPlayer[i].setAttribute("onclick", "onPickclick(" + "'" + this.arr[i].type + "'" + ',' + "'" + this.arr[i].color + "'" + ")");
        }
    }//return the option to click on the img
    this.makeDisableFalse = function (imgPlayer) {
        for (var i = 0; i < imgPlayer.length; i++) {
            imgPlayer[i].removeAttribute("onclick");
        }
    }//no option to click on the img


    this.searchByType = function (type) {
        var index = undefined;
        for (var i = 0; i < player2.arr.length; i++) {
            if (player2.arr[i].type == type && ((tableDeck[tableDeck.length - 1].color == player2.arr[i].color) || (tableDeck[tableDeck.length - 1].type == player2.arr[i].type))) {
                index = i;
            }
            else if (tmpColor == player2.arr[i].color && player2.arr[i].type == type) {
                index = i;
            }
        }
        return index;
    }//search the card by type
    this.searchByColor = function (player) {
        for (var i = 0; i < player.arr.length; i++) {
            if (player.arr[i].color == tableDeck[tableDeck.length - 1].color) {
                return i;
            }
        }
        return null;
    }//search the card by color
    this.takiIssue = function () {
        var index = undefined;
        for (var i = 0; i < player2.arr.length; i++) {
            if ((player2.arr[i].type == "taki" || checkTaki == true) && tableDeck[tableDeck.length - 1].color == player2.arr[i].color)
                index = i;

            else if ((tmpColor == player2.arr[i].color && player2.arr[i].type == "taki")) {
                index = i;
            }
        }


        if (index != undefined) {
            if (specialEvents(player2.arr[index].type, player2.arr[index].color, player2.name, player2) == true) {
                tmpColor = "";
                return true;
            }
        }
        return false;

    }//checking if the computer player can put taki card
    this.stopIssueOrchangeDirectionIssue = function(index){
        if (index != undefined) {
            specialEvents(player2.arr[index].type, player2.arr[index].color, player2.name, player2);
            turn();
            return true;
        }
        return false;
    }//hudling the stop and changeDirection
    this.stopIssue = function () {
        var index = player2.searchByType("stop");
        return this.stopIssueOrchangeDirectionIssue(index);
    }//checking if the computer player can put stop card
    this.changeDirectionIssue = function () {
        var index = player2.searchByType("changesDirection");
        return this.stopIssueOrchangeDirectionIssue(index);
        
    }//checking if the computer player can put changeDirection card
    this.towPlush = function () {
        var index = player2.searchByType("2plush");
        if (index != undefined) {
            specialEvents(player2.arr[index].type, player2.arr[index].color, player2.name, player2);
            return true;
        }
        return false;
    }//checking if the computer player can put 2plush card
    this.sameColorIssue = function () {
        var index = undefined;
        for (var i = 0; i < player2.arr.length; i++) {
            if (tableDeck[tableDeck.length - 1].color == player2.arr[i].color && player2.arr[i].type != "taki" && player2.arr[i].type != "color") {
                index = i;
            }

            else if (tmpColor == player2.arr[i].color && player2.arr[i].type != "taki") {
                index = i;
            }
        }

        if (index != undefined) {
            insertCard(player2, player2.arr[index].type, player2.arr[index].color);
            tmpColor = "";
            turn();
            return true;
        }
        return false;
    }//checking if the computer player can put card from the same color
    this.sameTypeIssue = function () {
        var index = undefined;
        for (var i = 0; i < player2.arr.length; i++) {
            if (tableDeck[tableDeck.length - 1].type == player2.arr[i].type && player2.arr[i].type != "taki" && tableDeck[tableDeck.length - 1].type != "color") {
                index = i;
            }
        }

        if (index != undefined) {
            insertCard(player2, player2.arr[index].type, player2.arr[index].color)
            turn();
            return true;
        }
        return false;
    }//checking if the computer player can put card from the same type
    this.colorChangerIssue = function () {
        if (player2.search("color", "changer") != null) {
            insertCard(player2, "color", "changer");

            if (player2.arr.length == 0) {
                turn();
                return true;
            }

            let arrayColor = [];
            arrayColor["red"] = 0, arrayColor["blue"] = 0, arrayColor["green"] = 0, arrayColor["yellow"] = 0;
            for (var i = 0; i < player2.arr.length; i++) {
                if (player2.arr[i].color == "red") {
                    arrayColor["red"]++;
                }
                else if (player2.arr[i].color == "green") {
                    arrayColor["green"]++;
                }
                else if (player2.arr[i].color == "yellow") {
                    arrayColor["yellow"]++;
                }
                else if (player2.arr[i].color == "blue") {
                    arrayColor["blue"]++;
                }
            }

            let max = 0;
            let choosen;
            for (var k in arrayColor) {
                if (max <= arrayColor[k]) {
                    choosen = k;
                    max = arrayColor[k];
                }
            }
            alert("color selected is: " + choosen);
            tmpColor = choosen;

            turn();
            return true;
        }
        return false;
    }//checking if the computer player can put color changer card
}

//Card object
function Card(type, color) {
    this.name = type + "_" + color;
    this.type = type;
    this.color = color;
    this.image = "images/" + this.name + ".jpg";//src
}

//Shuffle the package, i took the function from the lecture
function shuffle() {
    var i = cashier.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = cashier[j];
        cashier[j] = cashier[i];
        cashier[i] = temp;
    }
}

//the function responsible to divide the cards to the players at the beggining.
//also, the function call to other function for show the cards on the screen, and dicide who play first.
function start() {
    removingElements();
    insertElements();
    newGame();
}

//insert the elements to the html page
function insertElements() {
    var deck = document.getElementById("Deck");
    var player1h3 = document.createElement("h1");
    player1h3.setAttribute("id", "player1");
    var first = document.createElement("div");
    first.setAttribute("id", "first");
    var tableDeckSpan = document.createElement("span");
    tableDeckSpan.setAttribute("id", "tableDeck");

    var cashierSpan = document.createElement("span");
    cashierSpan.setAttribute("id", "cashier");
    var second = document.createElement("div");
    second.setAttribute("id", "second");
    var player2h3 = document.createElement("h1");
    player2h3.setAttribute("id", "player2");
    var change = document.createElement("div");
    change.setAttribute("id", "change");

    deck.appendChild(player1h3);
    deck.appendChild(first);
    deck.appendChild(tableDeckSpan);
    deck.appendChild(cashierSpan);
    deck.appendChild(second);
    deck.appendChild(player2h3);
    document.getElementById("Deck").appendChild(change);
}

//insert home page elements to the html page
function showLogo() {
    var img = document.createElement("img");
    img.setAttribute("src", "images/logo.png");
    img.setAttribute("id", "logo");

    var start = document.createElement("input");
    start.setAttribute("type", "button");
    start.setAttribute("id", "start");
    start.setAttribute("onclick", "start()");
    start.setAttribute("value", "start game");
    start.style.marginLeft = "150px";

    var startButton = document.createElement("input");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("id", "startButton");
    startButton.setAttribute("onclick", "newGame()");
    startButton.setAttribute("value", "start new game");
    startButton.style.visibility = "hidden";
    var deck = document.createElement("div");
    deck.setAttribute("id", "Deck");

    var welcome = document.createElement("h1");
    welcome.innerText = "Welcome to the Taki game, click to start";
    document.body.appendChild(img);
    document.body.appendChild(welcome);
    document.body.appendChild(start);
    document.body.style.marginTop = "100px";

    //if the game playes before give an option to continue with the game
    if (localStorage.getItem("first") != undefined) {
        var resumeButton = document.createElement("input");
        resumeButton.setAttribute("type", "button");
        resumeButton.setAttribute("id", "resumeButton");
        resumeButton.setAttribute("onclick", "resumeGame()");
        resumeButton.setAttribute("value", "resume game");
        document.body.appendChild(resumeButton);
    }

    document.body.appendChild(startButton);
    document.body.appendChild(deck);
}

//check the turn of the next player
function turn() {
    var first = document.getElementById("first");
    var second = document.getElementById("second");

    //declate if there is a winner
    if (player1.arr.length == 0 || player2.arr.length == 0) {
        var deck = document.getElementById("Deck");
        first.style.border = "";
        second.style.border = "";
        setTimeout(function () {
            deck.innerHTML = "";
            document.body.removeChild(document.getElementById("startButton"));
            localStorage.clear();
            if (player1.arr.length == 0)
                document.body.innerHTML += "<h1>its a win for player 1</h1><img src = 'images/win-child.png' id = 'win'/>";
            else
                document.body.innerHTML += "<h1>its a win for player 2</h1><img src = 'images/win-child.png' id = 'win'/>";
        }, 500);
        return;
    }

    var imgPlayer1 = first.getElementsByTagName("img");
    var imgPlayer2 = second.getElementsByTagName("img");

    //if it is the turn of player1 we tell him thats his turn by border the div
    if (checkTurn == 2) {
        second.removeAttribute("style", "border:2px solid #FFCC66;border-radius: 6px;");
        first.setAttribute("style", "border:2px solid #7FFFD4;border-radius: 6px;");
        document.getElementById("cashier").getElementsByTagName("img")[0].setAttribute("onclick", "cardFromCashier()");
        player1.makeDisableTrue(imgPlayer1);
        player2.makeDisableFalse(imgPlayer2);
        checkTurn = 1;
    }
    //if it is the turn of player2 we tell him thats his turn by border the div
    else {
        first.removeAttribute("style", "border:2px solid #7FFFD4; border-radius: 6px;");
        second.setAttribute("style", "border:2px solid #FFCC66; border-radius: 6px;");
        document.getElementById("cashier").getElementsByTagName("img")[0].removeAttribute("onclick");
        player1.makeDisableFalse(imgPlayer1);
        checkTurn = 2;
        //the player wait 2 second and only after he can play
        setTimeout(function () { computerPlayer(); }, 2000);
    }

}

//show the cards of the players
function showCards() {
    var str = "";

    //present the players, and showing their cards
    document.getElementById("player1").innerHTML = "player 1";
    str += player1.render();
    document.getElementById("first").innerHTML += str;

    str = "";
    document.getElementById("player2").innerHTML = "player 2";
    str += player2.render();
    document.getElementById("second").innerHTML += str;

}

//the game of player 1
function onPickclick(type, color) {
    var str = "";

    //if we want to choose a color changer card
    if (type == "color" && color == "changer") {
        specialEvents(type, color, player1.name, player1);//method bellow inspect the special occations
        document.getElementById("startButton").style.visibility = 'hidden';//the player must pick a color
        return;
    }

    //if the color changer is in the table deck
    else if (tableDeck[tableDeck.length - 1].type == "color" && tableDeck[tableDeck.length - 1].color == "changer") {
        //check if the player pick a color
        if (color == tmpColor) {
            //check if the card he pick is special card
            if (specialEvents(type, color, player1.name, player1) == false) {
                insertCard(player1, type, color);//insert method from bellow
                tmpColor = "";
                turn();
            }
            //if it is special card we insert the card by calling the function specialEvents so we can end the action
            return;
        }
    }

    //if it is not color changer card
     if (type == tableDeck[tableDeck.length - 1].type || color == tableDeck[tableDeck.length - 1].color) {
        if (specialEvents(type, color, player1.name, player1) == true) {
            return;
        }
        else {
            insertCard(player1, type, color);
            turn();
        }
    }

    else {
        alert("Wrong pick");
        checkTaki = false;
        cardFromCashier();
    }
}

//checking the special events
function specialEvents(type, color, name, player) {
    var str = "";

    //if it is a color changer card, create a bottons and let him pick a color
    if (type == "color" && color == "changer") {
        insertCard(player, type, color);
        if (player1.arr.length == 0 || player2.arr.length == 0) {
            turn();
            return true;
        }

        alert("Pick color from below!")//alert to the player that he need to pick color from the buttoms
        for (var i = 0; i < 4; i++)
            str += '<input type= "button" id="' + colors[i] + '" value="' + colors[i] + '"onclick="changecolor(' + "'" + colors[i] + "'" + ');'
                + '"onmouseover="colorButton(' + "'" + colors[i] + "'" + ');' + '"onmouseout="removeColorButton(' + "'" + colors[i] + "'" + ') "/>';
        //if the player stopped now, save for playing later
        localStorage.setItem("change", JSON.stringify(str));
        document.getElementById("change").innerHTML = str;
        document.getElementById("cashierCard").removeAttribute("onclick");
        return true;
    }

    //if we are in taki occation the player can put all the cards from the same color
    else if (checkTaki == true) {
        insertCard(player, type, color);
        var index = player.searchByColor(player);

        if (index == null) {
            checkTaki = false;
        }

        else if (checkTurn == 1) {
            checkTurn = 2;
        }

        else if (checkTurn == 2) {
            checkTurn = 1;
        }
        turn();
        return true;
    }

    //the start of the taki occation
    else if (type == 'taki') {

        //the player must put the taki card first
        if (checkTurn == 1) {
            insertCard(player, type, color);
            var index = player.searchByColor(player);
            if (index != null) {
                checkTurn = 2;
                checkTaki = true;
            }

            else {
                checkTaki = false;
            }
            tmpColor = "";
            turn();
        }

        //if it player2 he must have at least more 2 cards from the same color
        else {

            var counter = 0;
            for (var i = 0; i < player.arr.length; i++) {
                if ((player.arr[i].color == tableDeck[tableDeck.length - 1].color || player.arr[i].color == tmpColor) && player.arr[i].type != "taki") {
                    counter++;
                }
            }

            if ((counter >= 2) || (counter == 1 && player.arr.length == 2) || (counter == 0 && player.arr.length == 1)) {
                insertCard(player, type, color);
                checkTurn = 1;
                checkTaki = true;
                turn();
                return true;
            }
            return false;
        }
        return true;
    }

    //if it is stop or changeDirection card, let the player to play one more play
    if (type == 'stop' || type == 'changesDirection') {
        insertCard(player, type, color);
        player.makeDisableTrue(document.getElementById(player.name).getElementsByTagName("img"));
        tmpColor = "";
        if (checkTurn == 1) {
            checkTurn = 2;
            turn();
        }
        else
            checkTurn = 1;
        return true;
    }

    //if it is 2 plush card, insert to the other card 2 cards from the cashier
    if (type == '2plush') {
        if (name == "first") {
            TwoPlushMethod(player2, player1, type, color);
        }

        else {
            TwoPlushMethod(player1, player2, type, color);
        }
        tmpColor = "";
        turn();
        return true;
    }
    return false;
}

//method of 2plush card
function TwoPlushMethod(playerGetCards, playerRemoveCard, type, color){
    var str = "";
    playerGetCards.insert(cashier.shift());
    //if there is not cards in the cashier we want to insert cards from the cashier
    if (cashier.length == 0) {
        soldOut();
    }
    playerGetCards.insert(cashier.shift());
    insertCard(playerRemoveCard, type, color);
    str = playerGetCards.render();
    document.getElementById(playerGetCards.name).innerHTML = str;
}

//special card change color, the method alert to the user which color was selected and replaces the turn
function changecolor(color) {
    //if the player continue, remove from local storage, and let him the choice to press the new start button
    localStorage.removeItem("change");
    document.getElementById("startButton").style.visibility = 'visible';
    tmpColor = color;
    localStorage.setItem("tmpColor", JSON.stringify(tmpColor));

    alert("color selected is: " + color);
    document.getElementById('change').innerHTML = "";
    document.getElementById("cashierCard").setAttribute("onclick", "cardFromCashier()");
    turn();

}

//the function inserts a Card to the player/to the tableDeck
function insertCard(player, type, color) {
    var str = "";
    var index = player.search(type, color);
    tableDeck.push(player.remove(player.arr[index]));
    str += player.render();
    document.getElementById("tableDeck").innerHTML = renderCard(tableDeck[tableDeck.length - 1]);
    document.getElementById(player.name).innerHTML = str;
}

//the function takes card from the cashier and insert it to the player
function cardFromCashier() {
    soldOut();//checking if there is cards in the cashier
    if (checkTurn == 1) {
        player1.insert(cashier.shift());
        document.getElementById("first").innerHTML = player1.render();
    }
    else {
        player2.insert(cashier.shift());
        document.getElementById("second").innerHTML = player2.render();
    }
    turn();
}

//returns the cards from the tableDeck to the cashier, or start the game from the beginning if there is just one card in the tableDeck
function soldOut() {
    var tmpTableDeck = [];
    if ((cashier.length == 1 || cashier.length == 0) && tableDeck.length > 1) {
        for (var i = 0; i < tableDeck.length - 1; i++) {
            tmpTableDeck.push(tableDeck[i]);
        }

        for (var i = 0; i < tmpTableDeck.length; i++) {
            cashier.push(tmpTableDeck[i]);
            tableDeck.shift();
        }
        shuffle();
    }
}

//change the color of the button by hover
function colorButton(color) {
    var button = document.getElementById(color);
    button.style.backgroundColor = color;
}

//change to default color 
function removeColorButton(color) {
    var button = document.getElementById(color);
    button.style.backgroundColor = "";
}

//start a new game 
function newGame() {
    checkTaki = false;
    if (document.getElementById("resumeButton") != undefined) {
        localStorage.clear();
        document.body.removeChild(document.getElementById("resumeButton"));
    }

    tableDeck = [];
    cashier = [];
    player1 = new Player("first");
    player2 = new Player("second");
    document.getElementById("first").innerHTML = "";
    document.getElementById("second").innerHTML = "";
    var str = "";

    //Build the cashier
    for (var i = 0; i < types.length; i++) {
        for (var j = 0; j < colors.length; j++) {
            var card = new Card(types[i], colors[j]);
            cashier.push(card);
        }
    }

    //two cards of color changer entered manually
    var card = new Card("color", "changer");
    cashier.push(card);
    cashier.push(card);
    shuffle();

    //Give cards for the players
    var flag = false;
    for (var i = 0; i < 16; i++) {
        var card = cashier.pop();
        if (flag == false) {
            player1.insert(card);
            flag = true;
        }
        else {
            player2.insert(card);
            flag = false;
        }
    }

    //Show the first card in the table desk, with this loop we promise that the first card would not be a command card
    var index = 0;
    while (cashier[index].type == "changesDirection" || cashier[index].type == "2plush" ||
        cashier[index].type == "stop" || cashier[index].type == "taki" || cashier[index].type == "color") {
        index++;
    }

    tableDeck.push(cashier[index]);
    cashier.splice(index, 1);
    document.getElementById("cashier").innerHTML = '<img src = "images/cashier.jpg"' + ' onclick = "cardFromCashier()" id ="cashierCard"/>';
    document.getElementById("tableDeck").innerHTML = renderCard(tableDeck[0]);

    showCards();
    checkTurn = 2;
    turn();
}

//computer plays
function computerPlayer() {

    if (player2.takiIssue() == true)
        return;
    else if (player2.stopIssue() == true)
        return;
    else if (player2.changeDirectionIssue() == true)
        return;
    else if (player2.towPlush() == true)
        return;
    else if (player2.sameColorIssue() == true)
        return;
    else if (player2.sameTypeIssue() == true)
        return;
    else if (player2.colorChangerIssue() == true)
        return;
    else {
        cardFromCashier();
        return;
    }

}

//remove elemets 
function removingElements() {
    //the start button become home page button
    var homePage = document.getElementById("start");
    homePage.setAttribute("value", "Home Page");
    homePage.setAttribute("onclick", "location.reload()");
    document.getElementById("startButton").style.visibility = "visible";
    homePage.style.marginLeft = "";
    document.body.style.marginTop = "";

    //removing the img, and the headline before we start the game
    document.body.removeChild(document.getElementsByTagName("img")[0]);
    document.body.removeChild(document.getElementsByTagName("h1")[0]);
}

//resume the game from before
function resumeGame() {
    player1.arr = [];
    player2.arr = [];
    var changeColor;
    document.body.removeChild(document.getElementById("resumeButton"));

    cardsOfPlayer1 = JSON.parse(localStorage.getItem("first"));
    for (var i = 0; i < cardsOfPlayer1.length; i++) {
        player1.insert(cardsOfPlayer1[i]);
    }

    cardsOfPlayer2 = JSON.parse(localStorage.getItem("second"));
    for (var i = 0; i < cardsOfPlayer2.length; i++) {
        player2.insert(cardsOfPlayer2[i]);
    }

    cashier = JSON.parse(localStorage.getItem("cashier"));
    tableDeck = JSON.parse(localStorage.getItem("tableDeck"));
    checkTurn = JSON.parse(localStorage.getItem("turn"));

    changeColor = JSON.parse(localStorage.getItem("change"));
    tmpColor = JSON.parse(localStorage.getItem("tmpColor"));
    localStorage.removeItem("tmpColor");

    removingElements();
    insertElements();
    showCards();
    document.getElementById("cashier").innerHTML = '<img src = "images/cashier.jpg"' + ' onclick = "cardFromCashier()" id ="cashierCard"/>';
    document.getElementById("tableDeck").innerHTML = renderCard(tableDeck[tableDeck.length - 1]);

    if (changeColor != undefined) {
        document.getElementById("change").innerHTML = changeColor;
        document.getElementById("startButton").style.visibility = 'hidden';
        checkTurn = 2;
    }
    turn();
}

//render the card
function renderCard(card) {
    var str = "<img src = " + card.image + ">";
    return str;
}

//render the back of the card
function renderBackCard(card) {
    var str = "<img src = 'images/back-card.jpg'>";
    return str;
}
