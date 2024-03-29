import './style.css'

let theWheel
const nameListField = document.getElementById('name-list')
const saveNamesBtn = document.getElementById('save-name')
let colors = ['#eae56f', '#89f26e', '#7de6ef', '#e7706f']
let initialNames = ['maruf', 'ali', 'tesseracts', 'vina', 'rina', 'mina', 'yash', 'reddi']
nameListField.value = initialNames.join('\n')
let colorIndex = 0
let segments = []

// create segments with color
const addSegment = (name) => {
    segments.push({
        fillStyle: colors[colorIndex],
        text: name
    })
    colorIndex++
    if (colorIndex === colors.length) colorIndex = 0
}

initialNames.forEach(addSegment)

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// update segments with new name list
saveNamesBtn.addEventListener("click", () => {
    nameListField.value.split('\n').forEach(name => {
        if (name && !initialNames.includes(name)) {
            addSegment(name)
            initialNames.push(name)
        }
    })
    renderWheel()
})


// Create new wheel object specifying the parameters at creation time.
const renderWheel = () => {

    theWheel = new Winwheel({
        'numSegments': segments.length,     // Specify number of segments.
        'outerRadius': 212,   // Set outer radius so wheel fits inside the background.
        'textFontSize': 28,    // Set font size as desired.
        'segments': segments        // Define segments including colour and text.
        ,
        'animation':           // Specify the animation to use.
            {
                'type': 'spinToStop',
                'duration': 5,     // Duration in seconds.
                'spins': 8,     // Number of complete spins.
                'callbackFinished': 'alertPrize()'
            }
    });
}
renderWheel()

// Vars used by the code in this page to do power controls.
var wheelPower = 0;
var wheelSpinning = false;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        if (wheelPower == 1) {
            theWheel.animation.spins = 3;
        } else if (wheelPower == 2) {
            theWheel.animation.spins = 8;
        } else if (wheelPower == 3) {
            theWheel.animation.spins = 15;
        }

        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').src = "spin_off.png";
        document.getElementById('spin_button').className = "";

        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}


// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize() {
    // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
    var winningSegment = theWheel.getIndicatedSegment();

    // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
    alert("You have won " + winningSegment.text + ". Congratulations!");
    resetWheel()
}