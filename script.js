
//add constants for each element that can be interacted with
const pageBody = document.getElementById("pageBody");
const dMainScreen = document.getElementById("dMainScreen");
const dCutsceneScreen = document.getElementById("dCutsceneScreen");

//main screen
const portrait = document.getElementById("portrait");
const button = document.getElementById("btn");
const tLove = document.getElementById("tLove");
const tMoney = document.getElementById("tMoney");
const tIncomePerSecond = document.getElementById("tIncomePerSecond");

const dShady = document.getElementById("dShady");
const dHousePurchased = document.getElementById("dHousePurchased")

const cLine0 = document.getElementById("cLine0");
const cLine1 = document.getElementById("cLine1");
const cLine2 = document.getElementById("cLine2");
const cLine3 = document.getElementById("cLine3");
const dConsole = document.getElementById("dConsole");

const tIncomePerClick = document.getElementById("tIncomePerClick");

//cutscene screen
const tCutsceneText = document.getElementById("tCutsceneText");
const tCutsceneSpeaker = document.getElementById("tCutsceneSpeaker");
const tCutsceneEnterPrompt = document.getElementById("tCutsceneEnterPrompt");
const dCutsceneMain = document.getElementById("dCutsceneMain");
const dCutsceneFinal = document.getElementById("dCutsceneFinal");
const tLoveFinal = document.getElementById("tLoveFinal");
const imgCutsceneHeart = document.getElementById("imgCutsceneHeart");
const cutscenePortrait = document.getElementById("cutscenePortrait");


//set global variables
let invLove = 0;
let minLove = 100;
let prevInvLove = 100;
setMinLove(100);
let currentExpression = "";

let money = 0;
let totalAssets = 0;
let incomePerClick = 0.50;
const timestep = 17;

let onMainScreen = true;
let paused = false;
let finalEventTriggered = false;
let wolfshiemEventTriggered = false;
let doLoveIncrease = false;
let doLoveDecrease = true;

let consoleLines = ["", "", "", ""];
var consoleBlinkTimeout;

let cutsceneAdvanceable = false;
var promptTimeout;
let loveFinal = 99;


//purchases
class Purchase {
  constructor(name, buttonText, cost, moneyPerSecond, count, costIncrease, minLove, tName, tCost, tCount, bBuy, specialBuyFunction, specialBuyCondition) {
    this.name = name;
    this.cost = cost;
    this.moneyPerSecond = moneyPerSecond;
    this.count = count;

    this.specialBuyCondition = specialBuyCondition;

    this.tName = document.getElementById(tName);
    this.tCost = document.getElementById(tCost);
    this.tCount = document.getElementById(tCount);
    this.bBuy = document.getElementById(bBuy);

    this.tName.innerHTML = this.name;
    this.tCost.innerHTML = truncMoney(this.cost);
    if (this.tCount != null) { this.tCount.innerHTML = this.count; }
    this.bBuy.innerHTML = buttonText;

    this.buy = () => {
      money -= this.cost;
      this.count++;
      if (this.tCount != null) { this.tCount.innerHTML = this.count; }
      this.cost *= costIncrease;
      this.tCost.innerHTML = truncMoney(this.cost);
      if (specialBuyFunction != null) { specialBuyFunction(); }
      setMinLove(minLove);
    }

    this.bBuy.addEventListener("click", this.buy);
  }

  updateButton() {
    if (this.specialBuyCondition != null) {
      this.bBuy.disabled = (money < this.cost) || (!this.specialBuyCondition()) || (finalEventTriggered && this.cost > 0);
    } else {
      this.bBuy.disabled = (money < this.cost) || (finalEventTriggered && this.cost > 0);
    }
  }
}

//business-related
var business0 = new Purchase(
  "Business Associate",
  "Hire",
  10,
  0.3,
  0,
  1.1,
  96,
  "tBusinessName0",
  "tBusinessCost0",
  "tBusinessCount0",
  "bBusinessBuy0",
);

var business1 = new Purchase(
  "Corner Store",
  "Purchase",
  30,
  1.2,
  0,
  1.1,
  85,
  "tBusinessName1",
  "tBusinessCost1",
  "tBusinessCount1",
  "bBusinessBuy1"
);

var business2 = new Purchase(
  "Drug Store",
  "Purchase",
  100,
  4,
  0,
  1.1,
  70,
  "tBusinessName2",
  "tBusinessCost2",
  "tBusinessCount2",
  "bBusinessBuy2",
  function() {
    if (!wolfshiemEventTriggered) {
      setTimeout(() => { eWolfshiem() }, 25000);
      wolfshiemEventTriggered = true;
    }
  }
);

var shady0 = new Purchase(
  "Illegal Bar",
  "Purchase",
  800,
  38,
  0,
  1.1,
  57,
  "tShadyName0",
  "tShadyCost0",
  "tShadyCount0",
  "bShadyBuy0"
);

var shady1 = new Purchase(
  "Underground Gambling Joint",
  "Purchase",
  3000,
  171,
  0,
  1.1,
  45,
  "tShadyName1",
  "tShadyCost1",
  "tShadyCount1",
  "bShadyBuy1"
);

var shady2 = new Purchase(
  "Turn Drug Store into Alcohol Distribution Facility",
  "Purchase",
  15000,
  1000,
  0,
  1.1,
  18,
  "tShadyName2",
  "tShadyCost2",
  "tShadyCount2",
  "bShadyBuy2",
  function() {
    business2.count--;
    business2.tCount.innerHTML = business2.count;
  },
  function() {
    return business2.count > 0;
  }
);

var shady3 = new Purchase(
  "?????????",
  "Purchase",
  200000,
  0,
  0,
  1,
  12,
  "tShadyName3",
  "tShadyCost3",
  "tShadyCount3",
  "bShadyBuy3",
  function() {
    moneyGained = shady3.cost * 2;
    money += moneyGained;
    updateConsole("“NEWS: EIGHT WHITE SOX PLAYERS ARE INDICTED ON CHARGE OF FIXING 1919 WORLD SERIES!” ...and $" + truncMoney(moneyGained) + " has mysteriously appeared in your bank account.");
    shady3.tCost.innerHTML = "-----";
  },
  function() {
    return this.count === 0;
  }
);

//Daisy-related
var daisy0 = new Purchase(
  "West Egg Mansion",
  "Purchase",
  500000,
  0,
  0,
  1,
  10,
  "tDaisyName0",
  "tDaisyCost0",
  "tDaisyCount0",
  "bDaisyBuy0",
  function() {
    eHouse();
    daisy0.tCost.innerHTML = "-----";
  },
  function() {
    return this.count === 0;
  }
);

var daisy1 = new Purchase(
  "Fancy Car",
  "Purchase",
  100000,
  0,
  0,
  1.1,
  7,
  "tDaisyName1",
  "tDaisyCost1",
  "tDaisyCount1",
  "bDaisyBuy1",
  function() {
    updateConsole("Hmm, that didn’t seem to increase Daisy’s love for you either. Try something else.");
  }
);

var daisy2 = new Purchase(
  "Luxurious Yacht",
  "Purchase",
  200000,
  0,
  0,
  1.1,
  4,
  "tDaisyName2",
  "tDaisyCost2",
  "tDaisyCount2",
  "bDaisyBuy2",
  function() {
    updateConsole("Hmm, that didn’t seem to increase Daisy’s love for you either. Try something else.");
  }
);

var daisy3 = new Purchase(
  "Enormous Party",
  "Purchase",
  350000,
  0,
  0,
  1.1,
  3,
  "tDaisyName3",
  "tDaisyCost3",
  "tDaisyCount3",
  "bDaisyBuy3",
  function() {
    updateConsole("Hmm, that didn’t seem to increase Daisy’s love for you either. Try something else.");
  }
);

var daisy4 = new Purchase(
  "Ridiculously Extravagant Fruit Juicer",
  "Purchase",
  600000,
  0,
  0,
  1.1,
  1,
  "tDaisyName4",
  "tDaisyCost4",
  "tDaisyCount4",
  "bDaisyBuy4",
  function() {
    updateConsole("Hmm, even that didn’t seem to increase Daisy’s love for you. What is there left to do?");
  },
);

var daisy5 = new Purchase(
  "Invite Daisy for Tea",
  "Invite",
  0,
  0,
  0,
  1,
  1,
  "tDaisyName5",
  "tDaisyCost5",
  "tDaisyCount5",
  "bDaisyBuy5",
  function() {
    updateConsole("Hmm, that didn't seem to... oh?");
    setTimeout(() => { updateConsole("Wait… is this actually working?") }, 5000)
    doLoveIncrease = true;
    daisy5.bBuy.disabled = true;
  },
);


var purchases = [business0, business1, business2, shady0, shady1, shady2, shady3, daisy0, daisy1, daisy2, daisy3, daisy4, daisy5];


//start the game
setMainScreen(true);
gameStart();


//MAIN SCREEN

//common events
function gameStart() {
  addEventListeners();
  setInterval(doTimeStep, timestep);
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
  dShady.classList.add("hidden");
  dHousePurchased.classList.add("hidden");
  dFinal.classList.add("hidden");
  dCutsceneFinal.classList.add("hidden");
  imgCutsceneHeart.classList.add("hidden");

  tIncomePerClick.innerHTML = truncMoney(incomePerClick);
  updateui();

  updateConsole("Mr. Jay Gatsby- You’re in New York City, and you’re completely broke. Maybe you can find some menial labor to get some money.");
  setTimeout(() => {
    updateConsole("Otherwise, forget about trying to find your long lost love, Daisy. You’d probably need to own a half-million dollar mansion, or something ludicrously expensive like that.")
  }, 10000)
}

function updateui() {
  tLove.innerHTML = getLove();
  tMoney.innerHTML = truncMoney(money);
  tIncomePerSecond.innerHTML = truncMoney(getIncomePerSecond());
  purchases.forEach(p => p.updateButton());
}

function truncMoney(value) {
  if (value === 0) { return '0.00'}
  cents = '' + Math.trunc(value * 100);
  withCommas = '' + Math.trunc(value);
  for (i = withCommas.length - 3; i >= 1; i-=3) {
    withCommas = withCommas.substring(0, i) + ',' + withCommas.substring(i)
  }
  return withCommas + '.' + cents.substring(cents.length - 2);
}


//automatic income
function doTimeStep() {
  if (onMainScreen && !paused) {
    money += getIncomePerTimeStep(timestep);
    invLove += getDeltaInvLove(timestep);
    if (invLove >= 99) {
      eFinal();
    }
    updatePortrait();
    updateui();
  }
  if (doLoveIncrease) { animateLoveIncrease(timestep) }
}

function getIncomePerTimeStep(step) { return getIncomePerSecond() * step / 1000; }

function getIncomePerSecond() {
  return purchases.reduce((sum, current) => sum + current.count * current.moneyPerSecond, 0);
}


//automatic LOVE
function getDeltaInvLove(step) {
  k = 0.1;
  m = 101 - minLove - prevInvLove; //101 accounts for truncation
  invLoveDiff = invLove - prevInvLove
  lovePerSec = k * invLoveDiff * (1 - invLoveDiff / m);
  return lovePerSec * (step / 1000);
}

function setMinLove(value) {
  if (value < minLove) {
    prevInvLove = invLove - 0.8;
    minLove = value;
  }
}

function animateLoveIncrease(step) {
  if (invLove < 2) {
    startEndingCutscene();
    doLoveIncrease = false;
  }
  k = 0.2;
  invLove -= k * (100 - invLove) * (step / 1000);
  tLove.innerHTML = getLove();
  //updateConsole(invLove)
}

function getLove() {
  return Math.trunc(101 - invLove);
}


//update the expression shown on the portrait
function updatePortrait() {
  love = getLove();
  if (love <= 10) { portraitText = "gatsby_4.gif"; }
  else if (love <= 25) { portraitText = "gatsby_3.gif" }
  else if (love <= 50) { portraitText = "gatsby_2.gif" }
  else if (love <= 80) { portraitText = "gatsby_1.gif" }
  else { portraitText = "gatsby_0.gif" }

  if (currentExpression != portraitText) {
    portrait.src = portraitText;
    currentExpression = portraitText;
  }
}


//button events
function clickMoney() {
  money += incomePerClick;
  updateui();
  //updateConsole(truncMoney(money) + " dolar");
}

//TODO: delete later
function addMoney(val) {
  money += val;
}

//TODO: delete later
function subLove(val) {
  invLove += val;
}


//major events
function eWolfshiem() {
  updateConsole("You’ve met Meyer Wolfshiem! He says he knows how you can get filthy rich stupid quick; although I don’t remember him mentioning whether or not it’s legal.");
  revealDiv(dShady)
}
function eHouse() {
  updateConsole("Unfortunately, buying a massive estate didn’t remind Daisy of your existence. But now that you’ve got a mansion, you can buy a lot more things that will, right?")
  revealDiv(dHousePurchased);
}
function eFinal() {
  revealDiv(dFinal);
  finalEventTriggered = true;
  paused = true;
}
function revealDiv(div) {
  div.classList.remove('hidden');
  div.classList.add('flashAnimation')
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
  cLine0.classList.add("blinkAnimation");
  clearTimeout(consoleBlinkTimeout);
  consoleBlinkTimeout = setTimeout(() => {  cLine0.classList.remove("blinkAnimation"); }, 3000);
}


//CUTSCENE SCREEN

//switching between screens
function setMainScreen(value)
{
  if (value === true) {
    dMainScreen.classList.remove("hidden");
    dCutsceneScreen.classList.add("hidden");
    pageBody.style.backgroundColor = "white";
    onMainScreen = true;
  } else {
    dMainScreen.classList.add("hidden");
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
function setCutscenePortrait(name) { cutscenePortrait.src = name; }
function clearCutsceneText() {
  tCutsceneText.innerHTML = "";
  tCutsceneSpeaker.innerHTML = "";
}

//display a full piece of cutscene dialogue
function cutsceneSay(speaker, text, expression, textSpeed) {
  setCutscenePortrait(expression);
  setCutsceneSpeaker(speaker);
  typeCutsceneText(text, textSpeed, 4, 1, 40);
}



//prompt the user to press enter to continue
function setEnterPromptVisibility(value) {
  if (value === true) {
    tCutsceneEnterPrompt.classList.add("blinkInAnimation");
  } else {
    clearTimeout(promptTimeout);
    tCutsceneEnterPrompt.classList.remove("blinkInAnimation");
  }
}


//advance the cutscene when enter is pressed
function advanceCutscene() {
  setEnterPromptVisibility(false);
  clearCutsceneText();
  if (cutsceneQueue.length > 0) {
    cutsceneQueue.shift()();
  } else {
    endCutsceneDialogue();
    //setMainScreen(true);
  }
}


//ENDING CUTSCENE

//start the ending cutscene
function startEndingCutscene(){
  setMainScreen(false);
  setEnterPromptVisibility(false);
  clearCutsceneText();
  setTimeout(() => {
    dCutsceneScreen.classList.remove("hidden");
    advanceCutscene();
  }, 3000);
}

//queue represents final cutscene dialogue in order it is shown
const cutsceneQueue = [
  function() {
    cutsceneSay(
      "GATSBY",
      "Daisy, that’s all over now. It doesn’t matter any more./Just tell Tom the truth--that you never loved him--and it’s all wiped out forever.",
      "gatsby_talk_0.gif",
      50
    )
  },
  function() {
    cutsceneSay(
      "DAISY",
      "Oh, you want too much! I love you now--isn’t that enough? I can’t help what’s past./I did love him once--but I loved you too.",
      "gatsby_1.gif",
      50
    )
  },
  function() {
    cutsceneSay(
      "TOM",
      "Even that’s a lie. She didn’t even know you were alive./Why--there’re things between Daisy and me that you’ll never know, things that neither of us can forget.",
      "gatsby_2.gif",
      50
    )
  },
  function() {
    cutsceneSay(
      "GATSBY",
      "You don’t understand!/You’re not going to take care of her anymore. Daisy’s leaving you.",
      "gatsby_talk_1.gif",
      50
    )
  },
  function() {
    cutsceneSay(
      "TOM",
      "She’s not leaving me!/Certainly not for a common swindler who’d have to steal the ring he put on her finger.",
      "gatsby_2.gif",
      50
    )
  },
  function() {
    cutsceneSay(
      "GATSBY",
      ".....",
      "gatsby_3.gif",
      150
    )
  },
  function() {
    cutsceneSay(
      "TOM",
      "You two start on home, Daisy. In Mr. Gatsby’s car. Go on. He won’t annoy you./I think he realizes that his presumptuous little flirtation is over.",
      "gatsby_4.gif",
      50
    )
  }
]

function endCutsceneDialogue() {
  dCutsceneMain.classList.add("hidden");
  setTimeout(() => {
    dCutsceneFinal.classList.remove("hidden");
    setInterval(() => { decreaseLoveFinal() }, timestep);
  }, 1000);
}

function decreaseLoveFinal() {
  if (doLoveDecrease) {
    loveFinal -= 0.5;
    tLoveFinal.innerHTML = Math.trunc(loveFinal);
    if (loveFinal < 0) {
      loveFinal = 0;
      //imgCutsceneHeart.classList.remove("hidden");
      setTimeout(() => {
        dCutsceneFinal.classList.add("hidden");
        //imgCutsceneHeart.classList.add("hidden");
      }, 5000)
      doLoveDecrease = false;
    }
  }
}
