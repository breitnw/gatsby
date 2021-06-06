
//add constants for each element that can be interacted with
const pageBody = document.getElementById("pageBody");
const dMainScreen = document.getElementById("dMainScreen");
const dCutsceneScreen = document.getElementById("dCutsceneScreen");

//main screen
const button = document.getElementById("btn");

const tCounter = document.getElementById("tCounter");
const tIncomePerSecond = document.getElementById("tIncomePerSecond");

const cLine0 = document.getElementById("cLine0");
const cLine1 = document.getElementById("cLine1");
const cLine2 = document.getElementById("cLine2");
const cLine3 = document.getElementById("cLine3");

const tIncomePerClick = document.getElementById("tIncomePerClick");

//cutscene screen
const tCutsceneText = document.getElementById("tCutsceneText");
const tCutsceneSpeaker = document.getElementById("tCutsceneSpeaker");
const tCutsceneEnterPrompt = document.getElementById("tCutsceneEnterPrompt");


//set global variables
let money = 0;
let incomePerClick = 1;
const timestep = 17;
let onMainScreen = true;

let consoleLines = ["", "", "", ""];
var consoleBlinkTimeout;

let cutsceneAdvanceable = false;
var promptTimeout;


//purchases
class Business {
  constructor(name, buttonText, cost, moneyPerSecond, count, costIncrease, tName, tCost, tCount, tMPS, bBuy, specialBuyFunction, specialBuyCondition) {
    this.name = name;
    this.cost = cost;
    this.moneyPerSecond = moneyPerSecond;
    this.count = count;

    this.specialBuyCondition = specialBuyCondition;

    this.tName = document.getElementById(tName);
    this.tCost = document.getElementById(tCost);
    this.tCount = document.getElementById(tCount);
    //this.tMPS = document.getElementById(tMPS);
    this.bBuy = document.getElementById(bBuy);

    this.tName.innerHTML = this.name;
    this.tCost.innerHTML = truncMoney(this.cost);
    if (this.tCount != null) { this.tCount.innerHTML = this.count; }
    this.bBuy.innerHTML = buttonText;
    //this.tMPS.innerHTML = this.moneyPerSecond;

    this.buy = () => {
      money -= this.cost;
      this.count++;
      if (this.tCount != null) { this.tCount.innerHTML = this.count; }
      this.cost *= costIncrease;
      this.tCost.innerHTML = truncMoney(this.cost);
      if (specialBuyFunction != null) { specialBuyFunction(); }
    }

    this.bBuy.addEventListener("click", this.buy);
  }

  updateButton() {
    if (this.specialBuyCondition != null) {
      this.bBuy.disabled = (money < this.cost) || (!this.specialBuyCondition());
    } else {
      this.bBuy.disabled = (money < this.cost)
    }
  }
}

//business-related
var business0 = new Business(
  "Business Associate",
  "Hire",
  10,
  0.5,
  0,
  1.2,
  "tBusinessName0",
  "tBusinessCost0",
  "tBusinessCount0",
  "tBusinessMPS0",
  "bBusinessBuy0"
);

var business1 = new Business(
  "Corner Store",
  "Purchase",
  100,
  6,
  0,
  1.2,
  "tBusinessName1",
  "tBusinessCost1",
  "tBusinessCount1",
  "tBusinessMPS1",
  "bBusinessBuy1"
);

var business2 = new Business(
  "Drug Store",
  "Purchase",
  500,
  40,
  0,
  1.2,
  "tBusinessName2",
  "tBusinessCost2",
  "tBusinessCount2",
  "tBusinessMPS2",
  "bBusinessBuy2"
);

var shady0 = new Business(
  "Illegal Bar",
  "Purchase",
  10000,
  800,
  0,
  1.2,
  "tShadyName0",
  "tShadyCost0",
  "tShadyCount0",
  "tShadyMPS0",
  "bShadyBuy0"
);

var shady1 = new Business(
  "Underground Gambling Joint",
  "Purchase",
  100000,
  10000,
  0,
  1.2,
  "tShadyName1",
  "tShadyCost1",
  "tShadyCount1",
  "tShadyMPS1",
  "bShadyBuy1"
);

var shady2 = new Business(
  "Turn Drug Store into Alcohol Distribution Center",
  "Purchase",
  1000000,
  80,
  0,
  1.2,
  "tShadyName2",
  "tShadyCost2",
  "tShadyCount2",
  "tShadyMPS2",
  "bShadyBuy2",
  function() {
    business2.count--;
    business2.tCount.innerHTML = business2.count;
  },
  function() {
    return business2.count > 0;
  }
);

var shady3 = new Business(
  "?????????",
  "Purchase",
  1000000,
  0,
  0,
  1,
  "tShadyName3",
  "tShadyCost3",
  "tShadyCount3",
  "tShadyMPS3",
  "bShadyBuy3",
  function() {
    moneyGained = 2000000;
    money += moneyGained;
    updateConsole("“NEWS: EIGHT WHITE SOX PLAYERS ARE INDICTED ON CHARGE OF FIXING 1919 WORLD SERIES!” ...and $" + moneyGained + " has mysteriously appeared in your bank account.");
    shady3.tCost.innerHTML = "-----";
  },
  function() {
    return this.count === 0;
  }
);

//Daisy-related
var daisy0 = new Business(
  "West Egg Mansion",
  "Purchase",
  1000000,
  0,
  0,
  1.2,
  "tDaisyName0",
  "tDaisyCost0",
  "tDaisyCount0",
  "tDaisyMPS0",
  "bDaisyBuy0",
  function() {
    updateConsole("daisy purchase");
    daisy0.tCost.innerHTML = "-----";
  },
  function() {
    return this.count === 0;
  }
);

var daisy1 = new Business(
  "Enormous Party",
  "Purchase",
  100000,
  0,
  0,
  1.2,
  "tDaisyName1",
  "tDaisyCost1",
  "tDaisyCount1",
  "tDaisyMPS1",
  "bDaisyBuy1",
  function() {
    updateConsole("daisy purchase");
  }
);

var daisy2 = new Business(
  "Fancy Car",
  "Purchase",
  250000,
  0,
  0,
  1.2,
  "tDaisyName2",
  "tDaisyCost2",
  "tDaisyCount2",
  "tDaisyMPS2",
  "bDaisyBuy2",
  function() {
    updateConsole("daisy purchase");
  }
);

var daisy3 = new Business(
  "Luxurious Yacht",
  "Purchase",
  600000,
  0,
  0,
  1.2,
  "tDaisyName3",
  "tDaisyCost3",
  "tDaisyCount3",
  "tDaisyMPS3",
  "bDaisyBuy3",
  function() {
    updateConsole("daisy purchase");
  }
);

var daisy4 = new Business(
  "Ridiculously Extravagant Fruit Juicer",
  "Purchase",
  1000000,
  0,
  0,
  1,
  "tDaisyName4",
  "tDaisyCost4",
  "tDaisyCount4",
  "tDaisyMPS4",
  "bDaisyBuy4",
  function() {
    updateConsole("daisy purchase");
    daisy4.tCost.innerHTML = "-----";
  },
  function() {
    return this.count === 0;
  }
);


var purchases = [business0, business1, business2, shady0, shady1, shady2, shady3, daisy0, daisy1, daisy2, daisy3, daisy4];


//start the game
setMainScreen(true);
gameStart();


//MAIN SCREEN

//common events
function gameStart() {
  addEventListeners();
  setInterval(doIncome, timestep);
  initializeui();
}

function addEventListeners() {
  button.addEventListener('click', clickMoney);
  /*
  document.addEventListener('keydown', function(event) {
    if (!onMainScreen && event.code == 'Space' && cutsceneAdvanceable) {
      advanceCutscene()
    }
  });
  */
  document.addEventListener('click', () => {
    if (!onMainScreen && cutsceneAdvanceable) {
      advanceCutscene()
    }
  });
}

function initializeui() {
  tIncomePerClick.innerHTML = truncMoney(incomePerClick);
  updateui();
}

function updateui() {
  tCounter.innerHTML = truncMoney(money);
  tIncomePerSecond.innerHTML = truncMoney(getIncomePerSecond());
  purchases.forEach(b => b.updateButton());
}

function truncMoney(value) {
  if (value === 0) { return '0.00'}
  str = '' + Math.trunc(value * 100);
  return Math.trunc(value) + '.' + str.substring(str.length - 2);
}


//automatic income
function doIncome() {
  if (onMainScreen) {
    money += getIncomePerTimeStep(timestep);
    updateui();
  }
}

function getIncomePerTimeStep(step) { return getIncomePerSecond() * step / 1000; }

function getIncomePerSecond() {
  return purchases.reduce((sum, current) => sum + current.count * current.moneyPerSecond, 0);
}


//button events
function clickMoney(){
  money += incomePerClick;
  updateui();
  updateConsole(truncMoney(money) + " dolar");
}


//console
function updateConsole(newLine)
{
  consoleLines.unshift(newLine);
  consoleLines.pop();
  cLine0.innerHTML = consoleLines[0];
  cLine1.innerHTML = consoleLines[1];
  cLine2.innerHTML = consoleLines[2];
  cLine3.innerHTML = consoleLines[3];
  cLine0.style.animation = "blink 1s linear infinite";
  clearTimeout(consoleBlinkTimeout);
  consoleBlinkTimeout = setTimeout(() => {  cLine0.style.animation = ""; }, 3000);

}



//CUTSCENE SCREEN

//switching between screens
function setMainScreen(value)
{
  if (value === true) {
    dMainScreen.style.display = "block";
    dCutsceneScreen.style.display = "none";
    pageBody.style.backgroundColor = "white";
    onMainScreen = true;
  } else {
    dMainScreen.style.display = "none";
    dCutsceneScreen.style.display = "block";
    pageBody.style.backgroundColor = "black";
    onMainScreen = false;
  }
  cutsceneAdvanceable = false;
}

//typing out text
function typeCutsceneText(text, speed, punctuationDelay, brDelay, impactDelay) {

  setEnterPromptVisibility(false);
  curDelay = 0;
  cutsceneAdvanceable = false;

  if (text[0] === "*") {
    text = text.substring(1);
    while (text[0] != "*") {
      tCutsceneText.innerHTML += text[0];
      text = text.substring(1);
    }
    text = text.substring(1);
    curDelay += impactDelay;
  }
  else if (text[0] === "." || text[0] === "!" || text[0] === "?" || text[0] === "-") {
    curDelay += punctuationDelay;
    tCutsceneText.innerHTML = text[0];
    text = text.substring(1);
  }
  else
  {
    tCutsceneText.innerHTML = text[0];
    text = text.substring(1);
  }

  let typingInterval = setInterval(() => {
    if (text.length < 1) {
      promptTimeout = setTimeout(() => {  setEnterPromptVisibility(true); }, 1000);
      clearInterval(typingInterval);
      cutsceneAdvanceable = true;
    }
    else {
      /*
      if (text[0] === "*") {
        text = text.substring(1);
        while (text[0] != "*") {
          tCutsceneText.innerHTML += text[0];
          text = text.substring(1);
        }
        text = text.substring(1);
        curDelay = impactDelay;
      }
      */
      /*
      while (text[0] === "#") {
        text = text.substring(1);
        curDelay += 1;
      }
      */
      while (text[0] === " ") {
        tCutsceneText.innerHTML += " ";
        text = text.substring(1);
      }
      while (text[0] === "/") {
        tCutsceneText.innerHTML += "<br>";
        text = text.substring(1);
        curDelay += brDelay;
      }

      if (curDelay > 0) curDelay--;
      else {
        tCutsceneText.innerHTML += text[0];
        if (text[0] === "." || text[0] === "!" || text[0] === "?" || text[0] === "-") {
          curDelay = punctuationDelay;
        }
        text = text.substring(1);
      }
    }
  }, speed);
}

function setCutsceneText(text) { tCutsceneText.innerHTML = text; }
function setCutsceneSpeaker(speaker) { tCutsceneSpeaker.innerHTML = speaker; }
function clearCutsceneText() {
  tCutsceneText.innerHTML = "";
  tCutsceneSpeaker.innerHTML = "";
}

//display a full piece of cutscene dialogue
function cutsceneSay(speaker, text, expression, textSpeed) {
  setCutsceneSpeaker(speaker);
  typeCutsceneText(text, textSpeed, 4, 1, 40);
}



//prompt the user to press enter to continue
function setEnterPromptVisibility(value) {
  if (value === true) {
    tCutsceneEnterPrompt.style.animation = "blinkIn 2s linear infinite";
  } else {
    clearTimeout(promptTimeout);
    tCutsceneEnterPrompt.style.opacity = 0;
    tCutsceneEnterPrompt.style.animation = "";
  }
}


//advance the cutscene when enter is pressed
function advanceCutscene() {
  setEnterPromptVisibility(false);
  clearCutsceneText();
  if (cutsceneQueue.length > 0) {
    cutsceneQueue.shift()();
  } else {
    setMainScreen(true);
  }

}


//ENDING CUTSCENE

//start the ending cutscene
function startEndingCutscene(){
  setMainScreen(false);
  setEnterPromptVisibility(false);
  clearCutsceneText();
  setTimeout(() => {
    advanceCutscene();
  }, 1000);
}

//queue represents final cutscene dialogue in order it is shown
const cutsceneQueue = [
  function() {
    cutsceneSay(
      "TOM",
      "*Even that’s a lie. She didn’t even know you were alive.*/Why--there’re things between Daisy and me that you’ll never know, things that neither of us can forget.",
      "none",
      50
    )
  },
  function() {
    cutsceneSay(
      "GATSBY",
      "You don’t understand!/You’re not going to take care of her anymore. Daisy’s leaving you.",
      "none",
      50
    )
  },
  function() {
    cutsceneSay(
      "TOM",
      "She’s not leaving me!/Certainly not for a common swindler who’d have to steal the ring he put on her finger.",
      "none",
      50
    )
  },
  function() {
    cutsceneSay(
      "GATSBY",
      ".....",
      "none",
      200
    )
  },
  function() {
    cutsceneSay(
      "TOM",
      "You two start on home, Daisy. In Mr. Gatsby’s car. Go on. He won’t annoy you./I think he realizes that his presumptuous little flirtation is over.",
      "none",
      50
    )
  }
]
