// ==UserScript==
// @name Tag Relevant User
// @include https://github.com/*/*/pull/*
// @include https://github.com/*/*/commit/*
// ==/UserScript==

(function() {
    "use strict";
    document.addEventListener("click", tagRelevantUser);
})();

async function tagRelevantUser(event) {
    await waitForTextarea();
    const element = event.target;
    if (isReply(element)) {
        tagUserInReply(element);
    }
    else if (isThreadStarter(element)) {
        tagUserInThreadStarter(element);
    }

    async function waitForTextarea() {
        await sleep(10);
    }
}
function sleep(ms){
	return new Promise(function(resolve){
		setTimeout(resolve, ms);
	});
}
function isReply(element) {
    return element && element.classList.contains("review-thread-reply-button");
}
function isThreadStarter(element) {
    return element && element.classList.contains("add-line-comment");
}
function tagUserInReply(element) {
    const context = element.parentElement.parentElement.parentElement.parentElement.parentElement;
    const textarea = context.querySelector(".comment-form-textarea");
    const comments = context.parentElement.querySelectorAll(".review-comment")
    const lastCommentAuthor = comments[comments.length - 1].querySelector(".author");
    tagUser(textarea, lastCommentAuthor.textContent);
}
function tagUserInThreadStarter(element) {
    const textarea = element.parentElement.parentElement.nextElementSibling.querySelector(".comment-form-textarea");
    const pullRequestAuthor = document.querySelector(".gh-header-meta .author");
    const commitAuthor = document.querySelector(".commit-author");
    tagUser(textarea, (pullRequestAuthor || commitAuthor).textContent);
}
function tagUser(textarea, username) {
    if (textarea && textarea.value.length === 0) {
        textarea.value = "@" + username + " ";
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
}
