
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
let incomePerClick = 3;
const timestep = 17;
let onMainScreen = true;

let consoleLines = ["", "", "", ""];
var consoleBlinkTimeout;

let cutsceneAdvanceable = false;
var promptTimeout;


//purchases
class Business {
  constructor(name, cost, moneyPerSecond, count, tName, tCost, tCount, tMPS, bBuy) {
    this.name = name;
    this.cost = cost;
    this.moneyPerSecond = moneyPerSecond;
    this.count = count;

    this.tName = document.getElementById(tName);
    this.tCost = document.getElementById(tCost);
    this.tCount = document.getElementById(tCount);
    this.tMPS = document.getElementById(tMPS);
    this.bBuy = document.getElementById(bBuy);

    this.tName.innerHTML = this.name;
    this.tCost.innerHTML = this.cost;
    this.tCount.innerHTML = this.count;
    this.tMPS.innerHTML = this.moneyPerSecond;

    this.buy = () => {
      money -= this.cost;
      this.count++;
      this.tCount.innerHTML = this.count;
    }
    this.bBuy.addEventListener("click", this.buy);
  }

  updateButton() {
    this.bBuy.disabled = (money < this.cost);
  }
}

var business0 = new Business(
  "name 0",
  10,
  0.5,
  0,
  "tBusinessName0",
  "tBusinessCost0",
  "tBusinessCount0",
  "tBusinessMPS0",
  "bBusinessBuy0"
);

var business1 = new Business(
  "name 1",
  100,
  6,
  0,
  "tBusinessName1",
  "tBusinessCost1",
  "tBusinessCount1",
  "tBusinessMPS1",
  "bBusinessBuy1"
);

var business2 = new Business(
  "name 2",
  1000,
  80,
  0,
  "tBusinessName2",
  "tBusinessCost2",
  "tBusinessCount2",
  "tBusinessMPS2",
  "bBusinessBuy2"
);



var businesses = [business0, business1, business2];

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
  tIncomePerClick.innerHTML = incomePerClick;
  updateui();
}

function updateui() {
  tCounter.innerHTML = Math.trunc(money);
  tIncomePerSecond.innerHTML = getIncomePerSecond();
  businesses.forEach(b => b.updateButton());
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
  return businesses.reduce((sum, current) => sum + current.count * current.moneyPerSecond, 0);
}


//button events
function clickMoney(){
  money += incomePerClick;
  updateui();
  updateConsole(money + " dolar");
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
      "........",
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
