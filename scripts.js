//global ariables used in the script
var startTime;
var finishTime;
var elapsedTime;
var sampleText;
var inputText;
var underlinedText;
var speeed;
var errors;

$(document).ready(function () {

	//Initialize all variables on page load
	sampleText = $("#sampleText").text();
	inputText = "";
	underlinedText = "";
	errors = 0;

	$("#finish").attr("disabled", true);
	$("#theText").attr("disabled", true);
	$("#resultSpeed").hide();
	$("#resultErrors").hide();
	$("#chartContainer").hide();

	$("#start").click(function () {
		setStartTime();
		$("#finish").attr("disabled", false);
		$("#start").attr("disabled", true);
		$("#theText").attr("disabled", false);
		$("#theText").val("");
		clearResultSection();

	});
	$("#finish").click(function () {
		setFinishTime();

		$("#finish").attr("disabled", true);
		$("#start").attr("disabled", false);

		inputText = $("#theText").val();
		speed = calculateTypingSpeed(inputText);
		var inputWords = inputText.trim().split(/\s+/);

		if (inputWords.length < 5) {
			$("#resultSpeed").text("You did not type enough words.");
			$("#resultErrors").hide();
			$("#underlinedText").hide();
			$("#chartContainer").hide();
			$("#resultSpeed").show();
			return;
		}
		errors = checkText(inputText);

		$("#resultSpeed").addClass("alert alert-info");
		$("#resultSpeed").show();

		$("#resultSpeed").text("Your speed is: ~" + Math.round(speed) + " words/minute.");
		
		if (errors != 0) {
			$("#resultErrors").show();
			$("#underlinedText").show();
			$("#underlinedText").html(underlinedText);
			$("#resultErrors").text("You made: " + errors + " error(s)!");
		}
		$("#chartContainer").show();
		displayChart();
	});

	//Prevent user from pasting into the textarea
	$("#theText").onpaste = function (e) {
		e.preventDefault();
	}
});

function setStartTime() {
	startTime = new Date();
}

function setFinishTime() {
	finishTime = new Date();
}

function elapsedTime() {
	return (finishTime - startTime);
}

function calculateTypingSpeed(text) {

	var seconds = (new Date(elapsedTime())).getSeconds();
	return (inputText.trim().split(/\s+/).length) * 60 / seconds;
}

function checkText(text) {
	var originalWords = sampleText.trim().split(" ");
	var typedWords = text.trim().split(/\s+/);
	underlinedText = "";

	errors = 0;
	for (i = 0; i < typedWords.length; i++) {
		if (typedWords[i].trim() != originalWords[i]) {
			errors += 1;
			underlinedText += " " + "<u>" + typedWords[i] + "</u>";
		} else {
			underlinedText += " " + typedWords[i];
		}
	}
	return errors;
}

function clearResultSection() {
	errors = 0;
	$("#resultSpeed").hide();
	$("#resultErrors").hide();
	$("#underlinedText").hide();
	$("#chartContainer").hide();
}

//function to display a canvasjs chart about typing speeds
function displayChart() {
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		theme: "light2", // "light1", "light2", "dark1", "dark2"
		title: {
			text: "Typing Speeds"
		},
		axisY: {
			title: "Percentage of population",
			suffix: "%",
			includeZero: false
		},
		axisX: {
			title: "Typing Speeds (Words Per Minute)"
		},
		data: [{
			type: "column",
			dataPoints: [
				{
					label: "0-10",
					y: 9
				},
				{
					label: "10-20",
					y: 11
				},
				{
					label: "20-30",
					y: 12
				},
				{
					label: "30-40",
					y: 15
				},
				{
					label: "40-50",
					y: 12
				},
				{
					label: "50-60",
					y: 11
				},
				{
					label: "60-70",
					y: 10
				},
				{
					label: "70+",
					y: 5
				}
		]
	}]
	});
	chart.render();
}
