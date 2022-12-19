document.getElementById("lyricsSubmit").addEventListener("click", formatAndShowResultInForm)


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
        for (var word of splitLine) {
            if (word !== "") {
                if (resultLine.length === 0) {
                    resultLine.push(toTitleCase(word))
                } else {
                    resultLine.push(word)
                }
            }
        }
        return resultLine.join(" ")
    }
}


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        }
    )
}