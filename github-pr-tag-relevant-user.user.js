// ==UserScript==
// @name Tag Relevant User
// @version 0.3.0
// @description Tag the most relevant user in the context when writing a comment on a PR
// @license MIT
// @author Colin Grodecoeur
// @namespace https://github.com/colingdc
// @include https://github.com/*/*/pull/*
// @include https://github.com/*/*/commit/*
// @include https://github.com/*/*/issues/*
// @downloadURL https://raw.githubusercontent.com/colingdc/userscripts/master/github-pr-tag-relevant-user.user.js
// @updateURL https://raw.githubusercontent.com/colingdc/userscripts/master/github-pr-tag-relevant-user.user.js
// ==/UserScript==

const CONFIG = {
    TAG_USER_IN_COMMENT_REPLY: true,
    TAG_USER_IN_THREAD_STARTER: true,
    TAG_USER_IN_NEW_COMMENT: true
};

(function () {
    "use strict";
    document.addEventListener("click", tagRelevantUser);
})();

async function tagRelevantUser(event) {
    await waitForTextarea();
    const element = event.target;
    if (CONFIG.TAG_USER_IN_COMMENT_REPLY && isReply(element)) {
        tagUserInReply(element);
    } else if (CONFIG.TAG_USER_IN_THREAD_STARTER && isThreadStarter(element)) {
        tagUserInThreadStarter(element);
    } else if (CONFIG.TAG_USER_IN_NEW_COMMENT && isNewCommentField(element)) {
        tagUserInNewCommentField(element);
    }

    async function waitForTextarea() {
        await sleep(10);
    }
}
async function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function isReply(element) {
    return element && element.classList.contains("review-thread-reply-button");
}
function isThreadStarter(element) {
    return element && element.classList.contains("add-line-comment");
}
function isNewCommentField(element) {
    return element && element.id === "new_comment_field";
}
function tagUserInReply(element) {
    const context = element.closest(".review-thread-reply");
    const textarea = context.querySelector(".comment-form-textarea");
    const comments = context.parentElement.querySelectorAll(".review-comment");
    const lastCommentAuthor = comments[comments.length - 1].querySelector(".author");
    tagUser(textarea, lastCommentAuthor.textContent);
}
function tagUserInThreadStarter(element) {
    const textarea = element.parentElement.parentElement.nextElementSibling.querySelector(".comment-form-textarea");
    const pullRequestAuthor = document.querySelector(".gh-header-meta .author");
    const commitAuthor = document.querySelector(".commit-author");
    tagUser(textarea, (pullRequestAuthor || commitAuthor).textContent);
}
function tagUserInNewCommentField(element) {
    const textarea = element;
    const issueOrPullRequestAuthor = document.querySelector(".gh-header-meta .author");
    tagUser(textarea, issueOrPullRequestAuthor.textContent);
}
function tagUser(textarea, username) {
    if (username === getLoggedInUsername()) { return; }
    if (textarea && textarea.value.length === 0) {
        textarea.value = `@${username} `;
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }

    function getLoggedInUsername() {
        const metaUserLogin = document.querySelector('meta[name="user-login"]');
        return metaUserLogin && metaUserLogin.content;
    }
}
