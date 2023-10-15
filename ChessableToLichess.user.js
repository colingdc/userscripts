// ==UserScript==
// @name ChessableToLichess
// @version 0.1
// @description Go to Lichess analysis from Chessable in one click
// @match https://www.chessable.com/*/analysis/fen/*
// ==/UserScript==


(function () {
    "use strict";

    const url = new URL(window.location.href);
    const fen = decodeURIComponent(url.pathname.split("fen/")[1]).replaceAll("U", "/");
    const color = url.searchParams.get("o") ?? "white";
    
    const lichessUrl = "https://www.lichess.org/analysis/fromPosition/" + fen.split(" ").join("_") + "?color=" + color;
    
    const lichessLink = document.createElement("a");
    lichessLink.href = lichessUrl;
    lichessLink.textContent = "Lichess analysis";
    lichessLink.setAttribute("target", "_blank");
    lichessLink.style.marginLeft = "40px";

    const body = document.querySelector(".body");
    body.append(lichessLink);
})();
