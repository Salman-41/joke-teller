//DOM Elements
const button = document.getElementById("btn");
const audioElement = document.getElementById("audio");
const errorElement = document.getElementById("error");

// Error handling function
function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearError() {
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

// VoiceRSS Javascript SDK
const VoiceRSS = {
  speech: function (e) {
    this._validate(e), this._request(e);
  },
  _validate: function (e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      var a = !1;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw "The browser does not support the audio codec " + e.c;
    }
  },
  _request: function (e) {
    var a = this._buildRequest(e),
      t = this._getXHR();
    (t.onreadystatechange = function () {
      if (4 == t.readyState && 200 == t.status) {
        if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
        (audioElement.src = t.responseText), audioElement.play();
      }
    }),
      t.open("POST", "https://api.voicerss.org/", !0),
      t.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      ),
      t.send(a);
  },
  _buildRequest: function (e) {
    var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return (
      "key=" +
      (e.key || "") +
      "&src=" +
      (e.src || "") +
      "&hl=" +
      (e.hl || "") +
      "&r=" +
      (e.r || "") +
      "&c=" +
      (a || "") +
      "&f=" +
      (e.f || "") +
      "&ssml=" +
      (e.ssml || "") +
      "&b64=true" +
      "&v=" +
      (e.v || "")
    );
  },
  _detectCodec: function () {
    var e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : e.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : e.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : e.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : e.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  },
  _getXHR: function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};

//Enable/Disable Button
function toggleButton() {
  button.disabled = !button.disabled;
}

//Passing joke to VoiceRSS API
function tellJoke(joke) {
  VoiceRSS.speech(
    {
      key: "c597d12c35764cacb3812cc33a814f55",
      src: joke,
      hl: "en-us",
      v: "Linda",
      r: 0,
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: false,
    },
    function (error) {
      if (error) {
        showError(
          "An error occurred while processing the joke. Please try again."
        );
      }
    }
  );
}

async function getJokes() {
  try {
    clearError(); // Clear any previous errors
    let joke = "";
    const apiUrl =
      "https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
    const response = await fetch(apiUrl);
    if (!response.ok) {
      showError("Failed to fetch jokes. Please try again later.");
      return;
    }
    const data = await response.json();
    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    // Text-to-speech
    tellJoke(joke);
    // Disable button
    toggleButton();
  } catch (error) {
    showError(
      "An error occurred while fetching jokes. Please try again later."
    );
  }
}

button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", toggleButton);

// Clear error after 5 seconds (5000 milliseconds)
setTimeout(clearError, 5000);
