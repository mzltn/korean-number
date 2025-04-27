var ans = "";
var questionMode = "sino";
var answerMode = "number";
var slider = '';
var waiting = false;

function checkState() {
  questionMode = $("#practice-type-select")[0].value;
  if (questionMode == 'sino') { 
    $("#rangeSliderDiv").css("display", "flex");
    $("#sigFigDiv").css("display", "flex");
  } else {
    $("#rangeSliderDiv").css("display", "none");
    $("#sigFigDiv").css("display", "none");
  }

  if ($("#number-korean").is(":checked")) {
    answerMode = "korean";
    $("#ans")[0].type = "text";
  } else {
    answerMode = "number";
    $("#ans")[0].type = "number";
  }
  genQuestion();
}

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function genQuestion() {
  var hangul = "";
  var number = "";
  if (questionMode == "native") {
    number = randInt(0, 99);
    hangul = number_to_native(number);
    number = number.toString();
  } else if (questionMode == "sino") {
    var [lowBound, upperBound] = $("#rangeSlider").slider("getValue");
    var mag = randInt(lowBound, upperBound); // 1 - 11
    var sigfig = Math.min(parseInt($("#sigfig").val()), mag); // 1 - 11
    number = (randInt(Math.pow(10, sigfig - 1), Math.pow(10, sigfig) - 1) * (Math.pow(10, mag - sigfig))).toString(); // 1 - 1e11
    hangul = number_to_sino(number);
  }
  hangul = hangul.trim();
  var questionText = "";
  if (answerMode == "number") {
    questionText = hangul;
    ans = number;
  } else {
    questionText = number;
    ans = hangul;
  }
  $("#question").text(questionText);
  $("#ans").val("").attr("disabled", false);

  if (!$("#number-korean").is(":checked")) {
    readAloud($("#question").text());
  }

  $("#ans").focus();
}

function checkAns() {
  var correct = false;
  if ($("#ans").val().replace(" ", "") == ans.replace(" ", "")) {
    $("#correct-ans").removeClass("text-danger").addClass("text-success")
    $("#correct-ans").text("Correct!")
    correct = true;
  } else {
    $("#correct-ans").removeClass("text-success").addClass("text-danger")
    if (answerMode == "number") {
      $("#correct-ans").text(parseInt(ans).toLocaleString());
    } else {
      $("#correct-ans").text(ans);
    }
  }
  if (correct) {
    waiting = true;
    $("#correct-ans").animate({ opacity: 1 }, 200, function () {
      $("#main").delay(1000).animate({ opacity: 0 }, 200, function () {
        genQuestion();
        $("#main").animate({ opacity: 1 }, 200, function () {
          waiting = false;
        });
      });
      $("#correct-ans").delay(1000).animate({ opacity: 0 }, 200);
    })
  } else {
    $("#correct-ans").animate({ opacity: 1 }, 200, function () {
      $("#correct-ans").focus();
    });
    if ($("#number-korean").is(":checked")) {
      readAloud(ans);
    }
  }
}

function getSigfig() {
  return parseInt($("#sigfig").val());
}

$(() => {
  slider = $("#rangeSlider").slider();
  slider.on('slideStop', genQuestion);

  slider = $("#tempoSlider").slider();
  slider.on('slideStop', function () {
    readAloud($("#question").text());
  });

  $("#sigfig").val("11");
  $("#sigfig").on("input", function () {
    $("#sigFigDisplay").text($("#sigfig").val());
  });
  $("#sigfig").change(checkState);

  $("#ans").keydown((e) => {
    if (waiting) return false;

    // Submit Handler
    if (e.key == "Enter") {
      if ($("#correct-ans").hasClass("text-danger") && $("#correct-ans").css("opacity") != "0") {
        waiting = true;
        $("#main").animate({ opacity: 0 }, 200, function () {
          genQuestion();
          $("#main").animate({ opacity: 1 }, 200, function () {
            waiting = false;
          });
        });
        $("#correct-ans").animate({ opacity: 0 }, 200);
      } else {
        checkAns();
      }
      return false;
    }

    if ($("#correct-ans").css("opacity") != "0") {
      return false;
    }

    // Validate Numbers Only
    if (answerMode == "korean") return true;
    valid = false;
    validKeys = ["Backspace", "ArrowLeft", "ArrowRight"]
    validKeys.forEach(key => {
      if (key == e.key) valid = true
    });
    if (!valid) {
      valid = (e.key.search(/[0-9]/) == 0);
    }
    if (!valid) {
      return false;
    }
  });

  checkState()

  $("#practice-type-select").change(checkState);
  $("#number-korean").change(checkState);

  $("#ans").focus();
  
  startLoadingVoices();
  $('#tts-select').on("change", () => {
    const index = $('#tts-select')[0].value;
    selectVoice(index);
    readAloud($("#question").text());
  });

  $("#question").click(() => {
    readAloud($("#question").text());
    console.log("hi");
  })
});
