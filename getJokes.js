async function getJokes() {
  try {
    let joke = "";
    const apiUrl =
      "https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    //text-to-speach
    tellJoke(joke);
  } catch (error) {
    //error
  }
}
