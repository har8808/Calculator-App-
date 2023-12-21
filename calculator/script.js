(function() {
    'use strict';
    // result
    var result;
    // current number
    var currNum;
    // prev result
    var prevResult;
    // history
    var history;
    // prev btn pressed
    var prevBtn;
    // math operation
    var mathOp;
    // prev math operation
    var prevMathOp;
    // math operation counter
    var mathOpCount;
    // math op pressed?
    var mathOpPress;
    // init
    var isInit;
    // main screen
    var mainScreen = document.querySelector('#main');
    // history screen
    var historyScreen = document.querySelector('#history');

    const display1El = document.querySelector(".historyS");
    const display2El = document.querySelector(".mainS");
    const numbersEl = document.querySelectorAll(".number");
    const operationEl = document.querySelectorAll(".operation");
    let lastOperation = "";
    

    // attach click events to buttons
    Array.prototype.forEach.call(document.querySelectorAll('.button'), function(btn) {
        btn.addEventListener('click', function(e) {
            // `e.currentTarget` or `this`
            var btnClicked = e.currentTarget.getAttribute('data-value');
            input(btnClicked);
        });
    });


    // initialize
    function init() {
        result = null;
        currNum = 0;
        prevBtn = null;
        mathOp = null;
        prevMathOp = null;
        mathOpCount = 0;
        history = '';
        mathOpPress = false;
        isInit = true;
        updateMainScreen(0);
        updateHistoryScreen(history);
    }

    //
    function input(btn) {

        // copy prev math op
        if (!isNaN(prevBtn) && btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.') {
            prevMathOp = mathOp;
        }

        switch(btn) {
            case '+': mathOpPress = true; mathOp = addition; break;
            case '-': mathOpPress = true; mathOp = subtraction; break;
            case '/': mathOpPress = true; mathOp = division; break;
            case '*': mathOpPress = true; mathOp = multiplication; break;
            case 'C': init(); break;
        }

        handler(btn);


        /* var fontSize = parseFloat(mainScreen.style.fontSize);
        // return to default main screen size
        if (fontSize < 3 && currNum.length < 11) {
            mainScreen.style.fontSize = '3rem';
        } */

        console.log('Result: ' + result);
        console.log('Prev result: ' + prevResult);
        console.log('current number: ' + currNum);
        console.log('btn: ' + btn);
        console.log('Prev Math Op: ' + prevMathOp);
        console.log('Math Op Counter: ' + mathOpCount);
        console.log('Prev btn: '+ prevBtn);
        console.log('History: ' + history);
        console.log('Main Screen ' + mainScreen.value);
        console.log('*'.repeat(15));
    }

    //
    function handler(btn) {
        // return if C wasn't pressed when divide by zero was done
        if (btn !== 'C' && result === 'Result is undefined' || result === 'Cannot divide by zero') {
            return;
        }

        // update history
        if (btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS') {
            history = (isNaN(prevBtn) && isNaN(btn)) ? history.slice(0, -1) + btn : history + btn;
        }

        // btn clicked is `Number` or `.`
        if (!isNaN(btn) || btn === '.') {
            if (btn === '.' && /^\d+$/.test(currNum)) {
                currNum = currNum + btn;
            } else if (!isNaN(btn)) {
                currNum = (!isNaN(prevBtn) && prevBtn !== null && mainScreen.value !== '0') || prevBtn === '.' ? currNum + btn : btn;
            }
            mathOpPress = false;
            updateMainScreen(currNum);
        // btn clicked is `Sign`
        } else {

            // update history
            if (btn === '-' || btn === '+' || btn === '*' || btn === '/') {
                // for example, when `-` is pressed, add `0 -` to history screen
                if ((prevBtn === null || prevBtn === '=') && !isInit) {
                    history = '0' + btn;
                    mathOpCount++;
                }

                if (!historyScreen.value.length && mainScreen.value.length) {
                    history = mainScreen.value + btn;
                }
            }

            // if math op was pressed and result is null
            if (mathOp && result === null) {
                result = Number(currNum);
            }

            // count percents
            if (btn === '%') {
                history = history.slice(0, -(currNum.length + 1));
                currNum = percentage(currNum, result);
                history += currNum + ' ';
                updateMainScreen(currNum);
            // count square or square root
            } else if (btn === 'sqr' || btn === 'sqrt' || btn === '1/x') {
                history = history.slice(0, -(currNum.length + btn.length)) + (btn === '1/x' ? '1/(' + currNum + ') ' : btn + '(' + currNum + ') ');
                currNum = (btn === 'sqr') ? square(currNum) : (btn === 'sqrt') ? squareRoot(currNum) : fraction(currNum);
                updateMainScreen(currNum);
                updateHistoryScreen(history);
            }

            // count result
            if (btn === '=') {
                // if math op exists
                if (mathOp) {
                    mathOpCount = 0;
                    // if last button pressed is `mathOperation`
                    // like `+, - etc.` before `=` was pressed
                    if (mathOpPress) {
                        mathOp(prevResult);
                    // if last button pressed is `digit` before `=` was pressed
                    } else {
                        mathOp(Number(currNum));
                    }

                    history = '';
                    prevBtn = btn;

                    updateMainScreen(result);
                    updateHistoryScreen(history);

                    return;
                }
            }

            // count math ops
            // if sign was pressed and prev btn isn't sign and except some buttons
            if (isNaN(btn) && (!isNaN(prevBtn) || prevBtn === '%' || prevBtn === 'sqr' || prevBtn === 'sqrt' || prevBtn === '1/x') &&
                btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.' && btn !== '%' && btn !== 'sqr' & btn !== 'sqrt' && btn !== '1/x') {
                mathOpCount++;
            }

            // count result in row
            if (mathOpCount >= 2 && (!isNaN(prevBtn) || prevBtn === 'sqrt' || prevBtn === 'sqr' || prevBtn === '1/x' || prevBtn === '%') && btn !== 'CE' && btn !== 'CS') {
                prevMathOp(Number(currNum));
                updateMainScreen(result);
            }

            if (btn === 'CE' && history.length > 0) {
                history = history.slice(0, -(currNum.length));
                currNum = '0';
                updateMainScreen(0);
            } else if (btn === 'CS') {
                if (result != mainScreen.value) {
                    currNum = currNum.slice(0, -1);
                    history = history.slice(0, -1);
                    if (!currNum.length) {
                        currNum = '0';
                    }
                    updateMainScreen(currNum);
                } else {
                    return;
                }
            }

            if (result !== null && btn !== 'CE' && btn !== 'CS') {
                updateHistoryScreen(history);
            }
        }

        prevBtn = btn;
        prevResult = result;
        isInit = false;
    }

    function updateMainScreen(val) {

        val = String(val);

        if (val.length > 10) {
            mainScreen.style.fontSize = '1.75rem';
            val = Math.round(val * 10000000000000000) / 10000000000000000;
        }

        mainScreen.value = val;
    }

    function updateHistoryScreen(history) {
        historyScreen.value = history;
    }

    function addition(val) {
        result += val;
    }

    function subtraction(val) {
        result -= val;
    }

    function division(val) {
        result /= val;
    }

    function multiplication(val) {
        result *= val;
    }

    function square(val) {
        return val * val;
    }

    function squareRoot(val) {
        return Math.sqrt(val);
    }

    function percentage(val, res) {
        return res * val / 100;
    }

    function fraction(val) {
        return 1 / val;
    }

    init();

    window.addEventListener('keydown', (e) => {
        if(
            e.key === '0' ||
            e.key === '1' ||
            e.key === '2' ||
            e.key === '3' ||
            e.key === '4' ||
            e.key === '5' ||
            e.key === '6' ||
            e.key === '7' ||
            e.key === '8' ||
            e.key === '9' ||
            e.key === '.'
        ){
            clickButtonEl(e.key);
        }else if (
            e.key === '+' || 
            e.key === '-' || 
            e.key === '/' || 
            e.key === '%' ||
            e.key === '*'
            ){
                clickOperation(e.key);
            console.log(e.key);
            }else if(e.key === 'Enter'){
            if (mathOp) {
                mathOpCount = 0;
                // if last button pressed is `mathOperation`
                // like `+, - etc.` before `=` was pressed
                if (mathOpPress) {
                    mathOp(prevResult);
                // if last button pressed is `digit` before `=` was pressed
                } else {
                    mathOp(Number(currNum));
                }
        
                history = '';
        
                updateMainScreen(result);
                updateHistoryScreen(history);
        
            }}else if(e.key == 'Delete'){
                history = history.slice(0, -(currNum.length));
                currNum = '0';
                init();
                updateMainScreen(0);
                updateHistoryScreen('');
            }else if(e.key == 'Backspace'){
                currNum = currNum.slice(0, -1);
                history = history.slice(0, -1);
                if (!currNum.length) {
                    currNum = '0';
                }
                updateMainScreen(currNum);
            }
    });

    function clickButtonEl(key) {
        numbersEl.forEach((button) => {
            if (button.innerText === key) {
              button.click();
            }
          });
    }
    function clickOperation(key) {
        operationEl.forEach((button) => {
            if(button.innerText === key){
                button.click()
               /*  if() */
            }
        });
    }
    
})();






