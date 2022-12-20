document.getElementById("lyricsSubmit").addEventListener("click", formatAndShowResultInForm)

const forbiddenLineEndings = [".", ","]


function formatAndShowResultInForm() {
    var submissionBox = document.getElementById("lyricsTextArea")
    var submittedLyrics = submissionBox.value
    var lyricsFixer = new LyricsFixer(submittedLyrics)
    submissionBox.value = lyricsFixer.fixLyrics()
}


class LyricsFixer {
    constructor(lyrics) {
        this.splitLyrics = lyrics.split("\n")
        this.consecutiveNewLines = 0
    }

    fixLyrics() {
        return this.#fixLyricsByLine()
    }

    #fixLyricsByLine() {
        var fixedLines = []
        for (var line of this.splitLyrics) {
            this.#checkForNewlines(line)
            if (this.consecutiveNewLines < 2) {
                fixedLines.push(this.#fixLineByWords(line))
            }
        }
        return fixedLines.join("\n")
    }

    #checkForNewlines(line) {
        if (line.trim() === "") {
            this.consecutiveNewLines += 1
        } else {
            this.consecutiveNewLines = 0
        }
    }

    #fixLineByWords(line) {
        var splitLine = line.split(" ")
        var resultLine = []
        for (var [index, word] of splitLine.entries()) {
            if (word !== "") {
                if (resultLine.length === 0) {
                    if (index === splitLine.length - 1) {
                        resultLine.push(removeForbiddenLineEndings(toTitleCase(word)))
                    } else {
                        resultLine.push(toTitleCase(word))
                    }
                } else if (index === splitLine.length - 1) {
                    resultLine.push(removeForbiddenLineEndings(word))
                } else {
                    resultLine.push(word)
                }
            }
        }
        return resultLine.join(" ")
    }
}


function toTitleCase(str) {
  var result = ""
  for (var [index, c] of str.split("").entries()) {
    if (index===0) {
      result += c.toUpperCase()
    } else {
      result += c.toLowerCase()
    }
  }
  return result
}

function removeForbiddenLineEndings(str) {
    var result = []
    var consecutiveDots = 0
    var stillDots = true
    var threeDots = "..."
    for (var c of str.split("").reverse()) {
      if (c==="."&stillDots) {
          consecutiveDots++
      }
      if (!forbiddenLineEndings.includes(c)) {
        result.push(c)
        stillDots = false
      }
    }
    if (consecutiveDots<2){
      threeDots = ""
    }
    return result.reverse().join("") + threeDots
  }
