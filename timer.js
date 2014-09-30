var $timerSetupForm = document.querySelector("#timer-setup");
var $countdownContainer = document.querySelector("#countdown");
var $countdown = document.querySelector(".display");
var $cancelCountdown = document.querySelector(".cancel");

var minutes = 15;
var seconds = 0;
var upwards = true;
var countDown;
var blinker;

$timerSetupForm.onsubmit = function() {
	minutes = Number(document.querySelector("#minutes").value);
	seconds = Number(document.querySelector("#seconds").value);
	direction = document.querySelector('input[name="direction"]:checked').value;
	
	if (direction == "up") {
		upwards = true;
	} else {
		upwards = false;
		$countdown.innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
	}
	
	countDown = beginCountdown(minutes, seconds);
	return false;
}

$cancelCountdown.onclick = cancelCountdown;

function beginCountdown(minutes, seconds) {
	$timerSetupForm.style.left = 10000;
	$countdownContainer.style.left = 0;

	var totalSeconds = (60 * minutes) + seconds;
	var secondsRemaining = totalSeconds;
	var secondsSinceEnd = 0 - totalSeconds;
	var initialMinutes = minutes;
	var initialSeconds = seconds;
	var secondsElapsed = 0;
	var warned = false;

	return setInterval(function() {
		secondsElapsed++;
		secondsRemaining--;
		secondsSinceEnd++;
		if (upwards) {
			minutes = Math.floor(secondsElapsed / 60);
			seconds = secondsElapsed - (minutes * 60);
		} else {
			if (secondsRemaining >= 0){
				minutes = Math.floor(secondsRemaining / 60);
				seconds = secondsRemaining - (minutes * 60);
			} else {
				minutes = Math.floor(secondsSinceEnd / 60);
				seconds = secondsSinceEnd - (minutes * 60);
			}
		}
		//if (upwards) {
			$countdown.innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
		// } else {
// 			$countdown.innerHTML = zeroPad(initialMinutes-minutes-1, 2) + ":" + zeroPad(initialSeconds-seconds+59, 2);
// 		}
		$countdownContainer.style.backgroundColor = "rgba(255, 0, 0, " + (secondsElapsed / totalSeconds) * (secondsElapsed / totalSeconds) + ")"

		if (secondsElapsed / totalSeconds >= 0.8 && !warned) {
			beep(200, 1);
			warned = true;
		}

		if (secondsElapsed >= totalSeconds) {
			beep(200, 2);
			done = true;
			if (!blinker) blinker = blink($countdown, 400);

			// cancelCountdown();
		}
	}, 1000);
}

function cancelCountdown() {
	clearInterval(countDown);
	clearInterval(blinker);

	countDown = null;
	blinker = null;

	$countdown.style.display = "";
	$countdownContainer.style.backgroundColor = null;
	$timerSetupForm.style.left = 0;
	$countdownContainer.style.left = -10000;
	$countdown.innerHTML = "00:00";
}

function zeroPad(number, numLength) {
	numStr = number.toString();

	while (numStr.length != numLength) {
		numStr = "0" + numStr;
	}

	return numStr;
}

function blink(element, speed) {
	var defaultDisplay = element.style.display;
	speed = speed || 200;

	return setInterval(function() {
		element.style.display = element.style.display != "none" ? "none" : defaultDisplay;
	}, speed)
}

var beep = (function () {
	var webaudio = window.audioContext || window.webkitAudioContext;

	if (webaudio) {
		var ctx = new webaudio;

		return function (duration, type, finishedCallback) {

			duration = +duration;

			// Only 0-4 are valid types.
			type = (type % 5) || 0;

			if (typeof finishedCallback != "function") {
				finishedCallback = function () {};
			}

			var osc = ctx.createOscillator();

			osc.type = type;

			osc.connect(ctx.destination);
			osc.noteOn(0);

			setTimeout(function () {
				osc.noteOff(0);
				finishedCallback();
			}, duration);
		};
	} else {
		return function() {};
	}
})();

