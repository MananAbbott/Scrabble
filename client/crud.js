export async function saveToWordScore(name, word, score) {
    const res = await fetch(`/wordScore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, word: word, score: score}),
    });
    const val = await res.json();
    return val;
  }
export async function saveToGameScore(name, score) {
    const res = await fetch(`/gameScore`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, score: score}),
    });
    const val = await res.json();
    return val;
}
  export async function getWordScores() {
    try {
      const res = await fetch(`/highestWordScores`, {
        method: 'GET'
      });
      const val = await res.json();
      return val;
    } catch (err) {
      console.log(err);
    }
  }

  export async function getGameScores() {
    try {
      const res = await fetch(`/highestGameScores`, {
        method: 'GET'
      });
      const val = await res.json();
      return val;
    } catch (err) {
      console.log(err);
    }
  }