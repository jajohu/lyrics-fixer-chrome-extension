document.getElementById("lyricsSubmit").addEventListener("click", formatAndShowResultInForm)

const forbiddenLineEndings = [".", ","]
const allowedOpenBrackets = ["(", "{", "["]
const allowedClosedBrackets = [")", "}", "]"]


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
                        resultLine.push(onlyThreeDots(toTitleCase(word)))
                    }
                } else if (index === splitLine.length - 1) {
                    resultLine.push(removeForbiddenLineEndings(word))
                } else {
                    resultLine.push(onlyThreeDots(word))
                }
            }
        }
        return resultLine.join(" ")
    }
}


function toTitleCase(str) {
    var result = ""
    var firstCharWasOpenBracket = false
    for (var [index, c] of str.split("").entries()) {
        if (index === 0) {
            if (allowedOpenBrackets.includes(c)) {
                result += c
                firstCharWasOpenBracket = true
            } else {
                result += c.toUpperCase()
            }
        } else if (firstCharWasOpenBracket) {
            result += c.toUpperCase()
            firstCharWasOpenBracket = false
        } else {
            result += c
        }
    }
    return result
}


function removeForbiddenLineEndings(str) {
    var closedBracket = ""
    if (allowedClosedBrackets.includes(str[str.length-1])) {
        closedBracket = str[str.length-1]
        str = str.slice(0, str.length-1)
    }
    return onlyThreeDots(str) + closedBracket
}


function onlyThreeDots(str) {
    var result = []
    var consecutiveDots = 0
    var stillDots = true
    var threeDots = "..."
    for (var c of str.split("").reverse()) {
        if (c === "." & stillDots) {
            consecutiveDots++
        }
        if (!forbiddenLineEndings.includes(c)) {
            result.push(c)
            stillDots = false
        }
    }
    if (consecutiveDots < 2) {
        threeDots = ""
    }
    return result.reverse().join("") + threeDots
}
