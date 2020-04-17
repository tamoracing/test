javascript:

var ACTION_CLASS_1 = "mUbCce";
var ACTION_CLASS_2 = "orLAid";
var CUSTOM_CLASS = "reply-container";
var ICON_CLASS_1 = "mUbCce";
var ICON_CLASS_2 = "fKz7Od";
var ICON_CLASS_3 = "OniOhf";
var ICON_CLASS_4 = "n8aqX";
var ACTIONS_CONTAINER_JSNAME = "jpbBj";
var ICON_SPAN_1_CLASS = "xjKiLb";
var ICON_SVG_CLASS = "f8lxbf";
var TEXT_INPUT_JSNAME = "g1zMPd";
var TEXT_PARENT_CONTAINER = "PjTrEc";
var TEXT_PLACEHOLDER_JSNAME = "LT24l";
var TEXT_PLACEHOLDER_HIDE_CLASS = "qs41qe";
var AUTHOR_CONTAINER_JSNAME = "Ne3sFf";
var TEXT_TO_REPLY_ELEMENT = "bgckF";

function init() {
	console.log("Adding reply button...");
	let actionContainers = getMessageActionsContainers();
	actionContainers.forEach(addReplyActionToActionContainer);
	addChangeConversationListener();
	addNewMessagesListener();
	console.log("Done :) ");
}

function getMessageActionsContainers() {
	let actionsContainers = document.querySelectorAll(`[jsname=${ACTIONS_CONTAINER_JSNAME}]`);
	let actionsContainerWithoutReplyAction = new Array();
	actionsContainers.forEach((actionsContainer) => {
		if (!!!actionsContainer.querySelector('.' + CUSTOM_CLASS)) {
			actionsContainerWithoutReplyAction.push(actionsContainer);
		}
	});
	return actionsContainerWithoutReplyAction;
}

function addReplyActionToActionContainer(actionContainer) {
	let replyActionContainer = createReplyActionContainer();
	addReplyClickHandler(replyActionContainer);
	actionContainer.insertBefore(replyActionContainer, actionContainer.firstChild);
}

function createReplyActionContainer() {
	let actionContainer = document.createElement('div');
	actionContainer.classList.add(ACTION_CLASS_1);
	actionContainer.classList.add(ACTION_CLASS_2);
	actionContainer.classList.add(CUSTOM_CLASS);
	let iconContainer = document.createElement('div');
	iconContainer.classList.add(ICON_CLASS_1);
	iconContainer.classList.add(ICON_CLASS_2);
	iconContainer.classList.add(ICON_CLASS_3);
	iconContainer.classList.add(ICON_CLASS_4);
	iconContainer.setAttribute("data-tooltip", "Responder");
	let iconSpan = document.createElement('span');
	iconSpan.classList.add(ICON_SPAN_1_CLASS);
	let icon2Span = document.createElement('span');
	icon2Span.style = "top: -10px";
	icon2Span.appendChild(createReplyIcon());
	iconSpan.appendChild(icon2Span);
	iconContainer.appendChild(iconSpan);
	actionContainer.appendChild(iconContainer);
	return actionContainer;
}

function createReplyIcon() {
	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	let path_1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	path_1.setAttribute("d", "m0.65747,7.18454l7.33102,6.1939c0.34037,0.28757 0.8902,0.08848 0.8902,-0.30969l0,-3.14119c0.15709,0 0.31419,-0.02212 0.4451,-0.02212c3.35132,0 6.07427,2.27847 6.07427,5.06572c0,1.1503 -0.47128,2.14574 -1.41384,3.09695c-0.36655,0.35394 0.13091,0.90696 0.62837,0.68575c3.29896,-1.41575 5.26263,-4.04815 5.26263,-7.0345c0,-4.46845 -4.37243,-8.07419 -9.76597,-8.07419c-0.41892,0 -0.86401,0.02212 -1.23056,0.06636l0,-3.03059c0,-0.39818 -0.54983,-0.59727 -0.8902,-0.30969l-7.33102,6.1939c-0.20946,0.17697 -0.20946,0.44242 0,0.61939zm1.09965,-0.30969l6.07427,-5.13209l0,2.47756c0,0.26545 0.288,0.48666 0.62837,0.44242c0.41892,-0.06636 1.04729,-0.15485 1.67566,-0.15485c4.79135,0 8.6925,3.22967 8.6925,7.21147c0,2.01302 -1.02111,3.87119 -2.8015,5.17633c0.26182,-0.59727 0.41892,-1.23878 0.41892,-1.90241c0,-3.29604 -3.19423,-5.95057 -7.12156,-5.95057c-0.81165,0 -1.49239,0 -1.49239,0.48666l0,2.47756l-6.07427,-5.13209z"); //Set path's data
	path_1.setAttribute("stroke", "#5f6368");
	path_1.setAttribute("stroke-width", "0.9");
	svg.appendChild(path_1);
	svg.classList.add(ICON_SVG_CLASS);
	return svg;
}

function addReplyClickHandler(container) {
	container.onclick = () => {
		let text = getTextElement(container);
		let quotedText = getTextToReply(container);
		let author = getTextAuthor(container);
		text.innerHTML = "_" + author + " dijo:_ &#8628;<br/>```" + `${quotedText}` + "```<br/>";
		let placeHolder = getTextPlaceHolder();
		placeHolder.classList.remove(TEXT_PLACEHOLDER_HIDE_CLASS);
		clickOnTextElement(container);
	};
}

function getTextElement(container) {
	let textElement = document.querySelectorAll(`[jsname=${TEXT_INPUT_JSNAME}]`);
	if (textElement.length == 1) {
		return textElement[0];
	} else {
		let parentContainer = container.closest(`[jsname=${TEXT_PARENT_CONTAINER}]`);
		textElement = parentContainer.querySelectorAll(`[jsname=${TEXT_INPUT_JSNAME}]`);
	}
	return textElement[0];
}

function getTextParentContainer(replyContainer) {
	return replyContainer.closest(`[jsname=o7uNDd]`);
}

function replaceAnchorLink(htmlMarkup) {
	let urlPattern = /(<a [^>]*href="([^>^\"]*)"[^>]*>)([^<]+)(<\/a>)/gi;
	return htmlMarkup.replace(urlPattern, "$2");
}

function replaceSpanTag(htmlMarkup) {
	let urlPattern = /(<span [^>]*[^>]*>)([^<]+)(<\/span>)/gi;
	return htmlMarkup.replace(urlPattern, "$2");
}

function replaceFormatTags(htmlMarkup) {
	let boldItalicStrikeRegex = /(<[bis]>|<\/[bis]>|\`)/gi;
	let scapedHtml = htmlMarkup.replace(boldItalicStrikeRegex, "");
	scapedHtml = replaceSpanTag(replaceAnchorLink(scapedHtml));

	return scapedHtml;
}

function getTextToReply(replyContainer) {
	let parentContainer = getTextParentContainer(replyContainer);
	let htmlText = parentContainer.querySelector('[jsname=' + TEXT_TO_REPLY_ELEMENT + ']').innerHTML;
	return replaceFormatTags(htmlText);
}

function getTextAuthor(replyContainer) {
	let parentContainer = getTextParentContainer(replyContainer);
	let authorContainer = parentContainer.closest('[jsname='+ AUTHOR_CONTAINER_JSNAME + ']').querySelector('[data-name]');
	let authorName = authorContainer.getAttribute('data-name');
	return authorName;
}

function getTextPlaceHolder() {
	return document.querySelectorAll(`[jsname=${TEXT_PLACEHOLDER_JSNAME}]`)[0];
}

function clickOnTextElement(container) {
	let parentContainer = container.closest(`[jsname=${TEXT_PARENT_CONTAINER}]`);
	parentContainer.querySelectorAll('[jsname=lDVNne]')[0].click();
}

function addChangeConversationListener() {
	document.querySelectorAll(`[jsname=uwkwCe]`)[0].addEventListener('DOMSubtreeModified', changeConversationHandler, false);
}

function changeConversationHandler() {
	let actionContainers = getMessageActionsContainers();
	actionContainers.forEach(addReplyActionToActionContainer);
	addNewMessagesListener();
}

function addLoadingMessagesListener() {
	document.querySelectorAll(`[jsname=T2dWE]`)[0].addEventListener('DOMSubtreeModified', loadingMoreMessagesHandler, false);
}

function loadingMoreMessagesHandler() {
	let actionContainers = getMessageActionsContainers();
	actionContainers.forEach(addReplyActionToActionContainer);
}

function addNewMessagesListener() {
	document.querySelector('[jsname=iyUusd]').addEventListener('DOMNodeInserted',loadingMoreMessagesHandler, false);
}

init();