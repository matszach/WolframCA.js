'use strict';

// ===== ===== const ===== ===== 
const CELL_SIZE = 5;
const CANVAS_WIDTH = 500/CELL_SIZE;
const CANVAS_HEIGHT = 650/CELL_SIZE;

let CVS;
let CTX;

// ===== ===== model ===== =====
const Rule = [
    [[1, 1, 1], 0],
    [[1, 1, 0], 1],
    [[1, 0, 1], 0],
    [[1, 0, 0], 1],
    [[0, 1, 1], 1],
    [[0, 1, 0], 0],
    [[0, 0, 1], 1],
    [[0, 0, 0], 0]
];

var History = [

];

var CurrentGeneration = [

];

// ===== ===== ON INIT ===== =====
$(document).ready(() => {
    CVS = document.getElementById('cvs');
    CTX = CVS.getContext('2d');
    loadRuleControll();
    CurrentGeneration = getRandomState();
    startTheGame();
});

// ===== ===== game logic ===== =====
function loadRuleControll() {
    let rHtml = '';
    Rule.forEach((e, i) => {
        rHtml += 
        `<div class=\"rule-setter\">
            <span class=\"cell-span ${e[0][0] == 1 ? 'black' : 'white'}\"></span>
            <span class=\"cell-span ${e[0][1] == 1 ? 'black' : 'white'}\"></span>
            <span class=\"cell-span ${e[0][2] == 1 ? 'black' : 'white'}\"></span>
            <br>
            <span class=\"arrow-span\">&rarr;</span>
            <span class=\"clickable cell-span ${e[1] == 1 ? 'black' : 'white'}\"
                onclick=\"changeRule(this, ${i})\"></span>
        </div>`;
    });
    $('#rule-setters-div').html(rHtml);
}

function changeRule(thisElement, index) {
    Rule[index][1] = Rule[index][1] == 1 ? 0 : 1;
    thisElement.className = `clickable cell-span ${Rule[index][1] == 1 ? 'black' : 'white'}`;
}

function getRandomState() {
    let g = [];
    times(CANVAS_WIDTH, i => g.push(Math.random() > 0.5 ? 1 : 0));
    return g;
}

function startTheGame() {
    setInterval(() => {
        nextGeneration();
        drawState();
    }, 50);
}

function nextGeneration() {
    History.push(CurrentGeneration);
    if (History.length > CANVAS_HEIGHT) {
        History = History.splice(1);
    }
    let newGeneration = [];
    times(CurrentGeneration.length, i => {
        let parents = getParents(i, CurrentGeneration);
        let state = 0;
        Rule.forEach(e => {
            if(arraysEqual(e[0], parents)) {
                state = e[1];
                return;
            }
        });
        newGeneration.push(state);
    });
    CurrentGeneration = newGeneration;
}

function getParents(i, generation) {
    let parents = [];
    if(i < 0) {
        parents.push(0);
    } else {
        parents.push(generation[i - 1]);
    }
    parents.push(generation[i]);
    if(i >= generation.length) {
        parents.push(0);
    } else {
        parents.push(generation[i + 1]);
    }
    return parents;
}


function drawState() {
    CTX.clearRect(0, 0, 500, 650)
    for(let i = 0; i < History.length; i++) {
        for(let j = 0; j < History[i].length; j++) {
            if(History[i][j] == 1){
                CTX.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}


// ===== ===== util ===== =====
function times(n, f){
    for(let i = 0; i < n; i++) {
        f(i);
    }
}

function arraysEqual(a1, a2) {
    if(a1.length != a2.length) {
        return false;
    } 
    for(let i = 0; i < a1.length; i++) {
        if(a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}