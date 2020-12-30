javascript:

var scriptV = "v2.0.0";
var FAV_ACTION_CLASS = "fav-container";
var DATE_CLASS = "b8Cb3d";
var MSG_DATE_JSNAME = 'E53oB';
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

// Style definitions ////////////////

var favContainerStyle = `
	font-family: "Google Sans", Arial, sans-serif;
	color: rgb(60, 64, 67);
	font-size: 14px;
	line-height: 1.25rem;
	letter-spacing: 0.25px;
	padding: 8px;
	position: absolute;
	right: 90px;
	top: 100%;
	background-color: white;
	border: 1px solid rgb(218, 220, 224);
	border-radius: 0px 0px 15px 15px;
	display: flex;
	align-items: center;
`;
var favMsgStyle = `
	cursor: pointer;
	display: flex;
    align-items: center;
`;
var msgListStyle = `
	font-family: "Google Sans", Arial, sans-serif;
	color: rgb(60, 64, 67);
	font-size: 14px;
	line-height: 1.25rem;
	letter-spacing: 0.25px;
	text-align: left;
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
	padding: 10px 0px;
	border: 2px solid #ccc;
	border-radius: 15px;
	max-height: 35vh;
	min-height: 20vh;
	overflow-y: scroll;
`;
var buttonStyle = `
	font-family: "Google Sans", Arial, sans-serif;
	font-size: 14px;
	line-height: 1.25rem;
	letter-spacing: 0.25px;
	background-color: white;
	border: 1px solid rgb(218, 220, 224);
	border-radius: 15px;
	padding: 2px 20px;
`;
var favMsgContainerStyle = `
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 10px;
	padding: 10px;
	background-color: #e4f7fb;
	align-items: center;
`;

var settingsContainerStyle = `
	display: flex;
	margin-left: 15px;
	cursor:pointer;
`;
var overlayDivStyle = `
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.5);
	z-index: 2;
	text-align: -webkit-center;
	display: none
`;
var overlayContainerStyle = `
	text-align: center;
	margin-top: 27vh;
	padding: 5vh;
	background-color: white;
	width: 55%;
	max-height: 50%;
	overflow: hidden;
	border-radius: 20px;
`;
var importFileButtonContainerStyle = `
	display: flex;
	height: 30vh;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 8px;
`;
// End style definitions ///////////////

function addFavClickHandler(favContainer) {
    favContainer.onclick = () => {
		let quotedText = getTextToSaveAsFav(favContainer);
        let author = getTextAuthor(favContainer);
		let datetime = getTextDate(favContainer);
		let msgObject = {
			"author": author,
			"datetime": datetime,
			"quotedText": quotedText,
		};
		addFavMsg(msgObject);
		favContainer.querySelector('path').firstElementChild.beginElement();
    };
}

function getFavStorage() {
    return localStorage.getItem('favMsgs')  ? JSON.parse(localStorage.getItem('favMsgs')) : {};
}

function saveFavStorage(favMsgs, skipUpdateTimestamp) {
	if (!skipUpdateTimestamp) {
		favMsgs.timestamp = Date.now();
	}
	let favMsgsJSON =  JSON.stringify(favMsgs);
	localStorage.setItem('favMsgs', favMsgsJSON);
	isInDrive ? updateFile(fileId, favMsgsJSON, setDriveInfo) : insertFile(favMsgsJSON, setDriveInfo);
}

function addFavMsg(msgObject) {
	let roomId = getCurrentRoomId();
	let favMsgs = getFavStorage();
	favMsgs[roomId] ? favMsgs[roomId].push(msgObject) : favMsgs[roomId] = [msgObject];
    saveFavStorage(favMsgs);
}

function updateMsgForCurrentRoom(newMsgsList) {
	newMsgsList = newMsgsList.filter((msg) => {return !!msg});
	let roomId = getCurrentRoomId();
	let favMsgs = getFavStorage();
	if (favMsgs[roomId]) {
		favMsgs[roomId] = newMsgsList;
		saveFavStorage(favMsgs);
	} else {
		console.error(`No se encontraron mensajes para la sala ${roomId}`);
	}
}

function getCurrentRoomId() {
	// Get relative path 
	let relativePath = document.URL.split(/search\/|room\/|dm\//g)[1];
	// Discard thread id if exists
    let roomId = relativePath.split('/')[0];
	return roomId;
}


function getFavsForRoom(roomId) {
	let favMsgs = getFavStorage();
	return favMsgs[roomId] || [];
}

function checkFirstTimeLoad() {
	let favStorage = getFavStorage();
	if (!favStorage.hideWarning) {
		openNoStorageWarning();
	}
}

function openNoStorageWarning() {
	let warningContainerTemplate = `
		<h1 style="font-family:'Google Sans', Arial, sans-serif;color: rgb(60, 64, 67);font-size: 1.25rem;font-weight: 500;color: #5f6368;">No hay mensajes destacados aún, puede que necesites importar la copia de respaldo</h1>
		<div style="display: flex;flex-direction:column;padding: 15px; text-align:left">
			<span style="margin: 10px 0px">
				<p style="font-family:'Google Sans', Arial, sans-serif;color: rgb(60, 64, 67);font-size: 15px;line-height: 1.25rem;letter-spacing: 0.25px;">
					No hay información de mensajes destacados en este navegador, si ya usaste los mensajes destacados anteriormente te sugerimos importar la copia de respaldo haciendo click en el ícono de configuraciones de Destacados
				</p>
			</span>
			<div style="font-family:'Google Sans', Arial, sans-serif;color: rgb(60, 64, 67);font-size: 15px">
				<input id="hide-warning" type="checkbox" checked>No volver a mostrar este mensaje en este navegador</input>
			</div>
		</div>
	`;
	let warningContainer = document.createElement('div');
	warningContainer.innerHTML = warningContainerTemplate;
	warningContainer.style = `
		display:flex;
		flex-direction: column;
		padding: 10px;
	`;
	toggleModal(warningContainer, closeWarningHandler);
}

function closeWarningHandler() {
	let hideWarningEl = document.getElementById("hide-warning");
	let favStorage = getFavStorage();
	favStorage.hideWarning = hideWarningEl.checked;
	saveFavStorage(favStorage);
	toggleModal();
}

///// MODAL //////
const overlayDiv = document.createElement('div');
let displayBool = false;
overlayDiv.style = overlayDivStyle;
document.querySelector('body').appendChild(overlayDiv);

function styleOverlay() {
  const contentContainer = document.querySelector('#container');
  contentContainer.style = overlayContainerStyle;
}

function displayOverlay(content, closeBtnHandler) {
    if(displayBool) {
		overlayDiv.innerHTML = ``;
		overlayDiv.appendChild(createFavMsgContainer(content, closeBtnHandler));
		styleOverlay();
    	overlayDiv.style.display = 'block';
  	} else {
    	overlayDiv.style.display = 'none';
    }
}

function createFavMsgContainer(content, closeBtnHandler) {
	let modalContainer = document.createElement('div');
	modalContainer.id = 'container';
	let closeButton = document.createElement('button');
	closeButton.textContent = 'Cerrar';
	closeButton.id = 'modal-close-btn';
	closeButton.style = buttonStyle;
	closeButton.onclick = closeBtnHandler || (() => toggleModal());
	modalContainer.appendChild(content);
	let actionsContainer = document.createElement('div');
	actionsContainer.appendChild(closeButton);
	modalContainer.appendChild(actionsContainer);
	return modalContainer;
}

function createFavMsgSettingsContainer() {
	let importFileContainer;
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		importFileContainer = createImportFileButtonContainer();
    //document.getElementById('import_fav_msgs').addEventListener('change', onChange);
	} else {
		importFileContainer = document.createElement('div');
		importFileContainer.innerText = 'El browser no soporta la API para cargar archivos';
	}
	return importFileContainer;
}

function createFavSettingsButtonContainer() {
	let settingsContainer = document.createElement('div');
	settingsContainer.appendChild(createFavSettingsButton());
	let settingsContent = createFavMsgSettingsContainer();
	settingsContainer.onclick = () => toggleModal(settingsContent);
	settingsContainer.style = settingsContainerStyle;
	return settingsContainer;
}

function createFavSettingsButton() {
	let svgHTML = `
	<path d="M13.9,22.5h-3.7c-0.7,0-1.4-0.5-1.4-1.3l-0.3-1.9c-0.3-0.1-0.5-0.3-0.8-0.5l-1.8,0.7c-0.7,0.3-1.5,0-1.8-0.6  
		l-1.8-3.2c-0.4-0.7-0.2-1.4,0.4-1.9l1.5-1.2c0-0.1,0-0.3,0-0.5c0-0.1,0-0.3,0-0.5l-1.5-1.2C2,10.1,1.8,9.3,2.2,8.7l1.8-3.2  
		c0.3-0.6,1.1-0.9,1.8-0.6l1.8,0.7c0.3-0.2,0.5-0.3,0.8-0.5l0.3-1.9C8.8,2.5,9.4,2,10.1,2h3.7c0.7,0,1.4,0.5,1.4,1.3l0.3,1.9  
		c0.3,0.1,0.5,0.3,0.8,0.5l1.8-0.7c0.7-0.3,1.5,0,1.8,0.7l1.8,3.2c0.4,0.7,0.2,1.4-0.4,1.9l-1.5,1.2c0,0.1,0,0.3,0,0.5s0,0.3,0,0.5  
		l1.5,1.2c0.6,0.4,0.7,1.2,0.4,1.9L20,19c-0.3,0.6-1.1,0.9-1.8,0.6l-1.8-0.7c-0.3,0.2-0.5,0.3-0.8,0.5l-0.3,1.9  
		C15.2,22,14.6,22.5,13.9,22.5z M13.3,21L13.3,21L13.3,21z M10.7,20.9L10.7,20.9C10.7,21,10.7,21,10.7,20.9z M10.6,20.5h2.8l0.4-2.5  
		l0.5-0.2c0.4-0.2,0.9-0.4,1.3-0.8l0.4-0.3l2.4,1l1.4-2.4l-2-1.6l0.1-0.6c0-0.3,0.1-0.5,0.1-0.8c0-0.3,0-0.5-0.1-0.8l-0.1-0.6l2-1.6  
		l-1.4-2.4l-2.4,1l-0.4-0.3c-0.4-0.3-0.9-0.6-1.3-0.8l-0.5-0.2L13.4,4h-2.8l-0.4,2.5L9.7,6.8C9.3,6.9,8.8,7.2,8.4,7.5L7.9,7.9  
		L5.6,6.9L4.2,9.3l2,1.6l-0.1,0.6c0,0.3-0.1,0.5-0.1,0.8s0,0.5,0.1,0.8l0.1,0.6l-2,1.6l1.4,2.4l2.4-1L8.4,17c0.4,0.3,0.9,0.6,1.3,0.8  
		l0.5,0.2L10.6,20.5z M18.2,18C18.2,18,18.2,18,18.2,18L18.2,18z M5.8,18L5.8,18C5.8,18,5.8,18,5.8,18z M18.2,6.5  
		C18.2,6.5,18.2,6.5,18.2,6.5L18.2,6.5z M5.8,6.5L5.8,6.5C5.8,6.5,5.8,6.5,5.8,6.5z M13.3,3.5L13.3,3.5L13.3,3.5z M12,8.7  
		c-1.3,0-2.4,0.7-3,1.8c-0.6,1.1-0.6,2.4,0,3.5c0.6,1.1,1.8,1.8,3,1.8c1.9,0,3.5-1.6,3.5-3.5S13.9,8.7,12,8.7z" stroke="#5f6368" stroke-width="0.5">
	</path>
	`;

	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.innerHTML = svgHTML;
	svg.classList.add(ICON_SVG_CLASS);
	return svg;
}

function createImportFileButtonContainer() {
	let buttonContainer = document.createElement('div');
	buttonContainer.style = importFileButtonContainerStyle;
	let inputFile = document.createElement('input');
	inputFile.type = 'file';
	inputFile.accept = '.json';
	inputFile.textContent = 'Importar archivo'
	inputFile.classList.add('import-button');
	inputFile.id = 'file-upload';
	inputFile.onchange = (event) => {
		var reader = new FileReader();
		reader.onload = importFavMsgsFromFile;
		reader.readAsText(event.target.files[0]);
	};
	
	let labelFile = document.createElement('label');
	labelFile.setAttribute('for', 'file-upload');
	labelFile.id = 'import_fav_msgs';
	labelFile.innerHTML = 'Para restaurar una copia de los mensajes destacados, tenés que importar el archivo <b>gchatFavMsgsBackup.json</b> que está en tu Google Drive';
	labelFile.style = `
		margin-bottom: 8px;
	`;

	let successContainer = document.createElement('div');
	successContainer.id = 'file-upload-success';
	successContainer.innerHTML = `✔️`;
	successContainer.style.display = 'none';

	buttonContainer.appendChild(labelFile);
	buttonContainer.appendChild(inputFile);
	buttonContainer.appendChild(successContainer);
	return buttonContainer;
}

function toggleModal(content, closeBtnHandler) {
	displayBool = !displayBool;
	displayOverlay(content, closeBtnHandler);
}

function addFavMsgToContainer() {
	let msgListContainer = document.createElement('div');
	msgListContainer.style = msgListStyle;
	let roomFavMsgs = getFavsForRoom(getCurrentRoomId());
	appendMessages(roomFavMsgs, msgListContainer);
	return msgListContainer;
}

function appendMessages(messages, container) {
	if (messages.length === 0) {
        let msgContainer = document.createElement('div');
        msgContainer.style = favMsgContainerStyle;
        msgContainer.innerHTML = '<i><b>Aún no hay mensajes destacados en esta sala.</b></i>'
        container.appendChild(msgContainer);
    } else {
		messages.forEach((msg, index) => {
			let msgContainer = document.createElement('div');
			msgContainer.style = favMsgContainerStyle;
			let spanMsg = document.createElement('span');
			let actionsContainer = document.createElement('div');
			let removeButton = document.createElement('button');
			removeButton.style = buttonStyle;
			removeButton.textContent = 'Quitar';
			removeButton.onclick = () => {
				messages[index] = null;
				updateMsgForCurrentRoom(messages);
				msgContainer.remove();
			}
			actionsContainer.appendChild(removeButton);
			spanMsg.innerHTML = `<b>${msg.author}</b><span class='${DATE_CLASS}'> ${msg.datetime}:</span><br>${msg.quotedText}`;
			msgContainer.appendChild(spanMsg);
			msgContainer.appendChild(actionsContainer);
			container.appendChild(msgContainer);
		});
	}
}
/////

//// FAV BUTTON /////////
function createFavButton() {
	let container = document.createElement('div');
	container.style = favContainerStyle;

	let showFavMsgsButton = document.createElement("div");
    showFavMsgsButton.id = "fav-msg-button";
	showFavMsgsButton.style = favMsgStyle;
	showFavMsgsButton.innerHTML = "Destacados";
	showFavMsgsButton.onclick = () => {
		let msgContent = addFavMsgToContainer();
        toggleModal(msgContent)
    };
    let favIconSvg = createFavIcon(false);
    let favActionContainer = createSvgIconContainer(favIconSvg, FAV_ACTION_CLASS);    
	showFavMsgsButton.appendChild(favActionContainer);

	let favButtonsContainer = document.createElement('div');
	favButtonsContainer.appendChild(showFavMsgsButton);

	container.appendChild(favButtonsContainer);
	container.appendChild(createFavSettingsButtonContainer());

    let banners = document.querySelectorAll("[role=banner]");
    banners[banners.length - 1].appendChild(container);
}
/////

// TODO check if imported file is older to localStorage and display confirmation action
function importFavMsgsFromFile(event) {
	console.log(event.target.result);
	var favMsgsImported = JSON.parse(event.target.result);
	saveFavStorage(favMsgsImported, true);
	document.getElementById('file-upload').style = 'display: none';
	document.getElementById('file-upload-success').style = 'display: block';

}

////////google integration////////////
/* global var to insert or update file in Drive */
var isInDrive = false;
var fileId = 0;

function checkDriveStatus() {
	getFileInfo().then((response) => {
		if (response.result && response.result.files && response.result.files.length > 0) {
			setDriveInfo(response.result.files[0]);
		}
	});
}

/**
 * @param {id: String, kind: String, mimeType: String, name: String} file 
 */
function setDriveInfo(file) {
	fileId = file.id || 0;
	isInDrive = !!file.id;
}

/// Validar si existe el archivo en el drive
function getFileInfo() {
	return gapi.client.request({
		path: 'https://www.googleapis.com/drive/v3/files',
		method: 'GET',
		params: {
			q: "name = 'gchatFavMsgsBackup.json'"
		}
	});
}

/// Crear archivo
function insertFile(favStorageString, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";
	var contentType = 'application/json';
	var metadata = {
	'title': 'gchatFavMsgsBackup.json',
	'mimeType': contentType
	};

	var base64Data = btoa(unescape(encodeURIComponent(favStorageString)));
	var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(metadata) +
		delimiter +
		'Content-Type: ' + contentType + '\r\n' +
		'Content-Transfer-Encoding: base64\r\n' +
		'\r\n' +
		base64Data +
		close_delim;

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files',
		'method': 'POST',
		'params': {'uploadType': 'multipart'},
		'headers': {
		'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': multipartRequestBody});
	if (!callback) {
		callback = function(file) {
			console.log(file)
		};
	}
	request.execute(callback);
}

/**
 * Update an existing file's metadata and content.
 *
 * @param {String} fileId ID of the file to update.
 * @param {Function} callback Callback function to call when the request is complete.
 */
function updateFile(fileId, favStorageString, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";
  
	var contentType = 'application/json';
	// Updating the metadata is optional and you can instead use the value from drive.files.get.
	var base64Data = btoa(unescape(encodeURIComponent(favStorageString)));
	var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		delimiter +
		'Content-Type: ' + contentType + '\r\n' +
		'Content-Transfer-Encoding: base64\r\n' +
		'\r\n' +
		base64Data +
		close_delim;

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/' + fileId,
		'method': 'PUT',
		'params': {'uploadType': 'multipart', 'alt': 'json'},
		'headers': {
		'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': multipartRequestBody});
	if (!callback) {
		callback = function(file) {
			console.log(file)
		};
	}
	request.execute(callback);
  }

//////////////

function init() {
	console.log("Adding fav and reply button...");
    let actionContainers = getMessageActionsContainers();
    actionContainers.reply.forEach(addReplyActionToActionContainer);
    actionContainers.fav.forEach(addFavActionToActionContainer);
	addChangeConversationListener();
    addNewMessagesListener();
    createFavButton();
	checkDriveStatus();
	checkFirstTimeLoad();
	console.log(`Done :) ${scriptV}`);
}

function getMessageActionsContainers() {
    let actionsContainers = document.querySelectorAll(`[jsname=${ACTIONS_CONTAINER_JSNAME}]`);
    let actionsContainerWithoutReplyAction = new Array();
    let actionsContainerWithoutFavAction = new Array();
	actionsContainers.forEach((actionsContainer) => {
		if (!!!actionsContainer.querySelector('.' + CUSTOM_CLASS)) {
			actionsContainerWithoutReplyAction.push(actionsContainer);
        }
        if (!!!actionsContainer.querySelector('.' + FAV_ACTION_CLASS)) {
			actionsContainerWithoutFavAction.push(actionsContainer);
		}
	});
    return {'reply': actionsContainerWithoutReplyAction, 'fav': actionsContainerWithoutFavAction};
}

function addReplyActionToActionContainer(actionContainer) {
	if (!!!actionContainer.querySelector('.' + CUSTOM_CLASS)) {
        let replyIconSvg = createReplyIcon();
		let replyActionContainer = createSvgIconContainer(replyIconSvg, CUSTOM_CLASS);
		addReplyClickHandler(replyActionContainer);
		actionContainer.insertBefore(replyActionContainer, actionContainer.firstChild);
	}
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

function getTextParentContainer(container) {
	return container.closest(`[jsname=o7uNDd]`);
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
    actionContainers.reply.forEach(addReplyActionToActionContainer);
    actionContainers.fav.forEach(addFavActionToActionContainer);
	addNewMessagesListener();
}

function addLoadingMessagesListener() {
	document.querySelectorAll(`[jsname=T2dWE]`)[0].addEventListener('DOMSubtreeModified', loadingMoreMessagesHandler, false);
}

function loadingMoreMessagesHandler() {
    let actionContainers = getMessageActionsContainers();
    actionContainers.reply.forEach(addReplyActionToActionContainer);
    actionContainers.fav.forEach(addFavActionToActionContainer);
}

function addNewMessagesListener() {
	document.querySelector('[jsname=iyUusd]').addEventListener('DOMNodeInserted',loadingMoreMessagesHandler, false);
}

function createSvgIconContainer(svgElement, iconClass) {
	let actionContainer = document.createElement('div');
	actionContainer.classList.add(ACTION_CLASS_1);
	actionContainer.classList.add(ACTION_CLASS_2);
	actionContainer.classList.add(iconClass);
	let iconContainer = document.createElement('div');
	iconContainer.classList.add(ICON_CLASS_1);
	iconContainer.classList.add(ICON_CLASS_2);
	iconContainer.classList.add(ICON_CLASS_3);
	iconContainer.classList.add(ICON_CLASS_4);
	iconContainer.setAttribute("data-tooltip", "Agregar a favoritos");
	let iconSpan = document.createElement('span');
	iconSpan.classList.add(ICON_SPAN_1_CLASS);
	let favIconSpan = document.createElement('span');
	favIconSpan.style = "top: -10px";
	favIconSpan.appendChild(svgElement);
	iconSpan.appendChild(favIconSpan);
	iconContainer.appendChild(iconSpan);
	actionContainer.appendChild(iconContainer);
	return actionContainer;
}

///////////// FAV /////////////////////

function addFavActionToActionContainer(actionContainer) {
    if (!!!actionContainer.querySelector('.' + FAV_ACTION_CLASS)) {
        let favIconSvg = createFavIcon(true);
        let favActionContainer = createSvgIconContainer(favIconSvg, FAV_ACTION_CLASS);
        addFavClickHandler(favActionContainer);
        actionContainer.insertBefore(favActionContainer, actionContainer.firstChild);
    }
}

function getTextToSaveAsFav(msgContainer) {
	let parentContainer = getTextParentContainer(msgContainer);
	let htmlText = parentContainer.querySelector('[jsname=' + TEXT_TO_REPLY_ELEMENT + ']').innerHTML;
	return replaceFormatTags(htmlText);
}

function createFavIcon(shouldAnimate) {
	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	let path_1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	path_1.setAttribute("d", "M 20.6789 7.2115 c -0.2996 -0.2637 -0.6688 -0.4336 -1.0672 -0.4915 l -4.8777 -0.7086 L 12.5523 1.5911 c -0.178 -0.3611 -0.4538 -0.6596 -0.7971 -0.8632 c -0.3184 -0.1887 -0.6834 -0.2886 -1.0559 -0.2886 s -0.7371 0.0999 -1.0559 0.2886 c -0.3433 0.2036 -0.6191 0.5022 -0.7971 0.8632 l -2.1814 4.42 L 1.7876 6.72 c -0.3984 0.0579 -0.7673 0.2278 -1.0672 0.4915 c -0.2779 0.2445 -0.4858 0.5608 -0.601 0.9148 c -0.1151 0.354 -0.1329 0.7317 -0.0515 1.0932 c 0.0874 0.3895 0.2861 0.7438 0.5747 1.0249 l 3.5297 3.4405 L 3.3389 18.5431 c -0.1034 0.602 0.0625 1.214 0.4545 1.6792 c 0.3952 0.4688 0.9716 0.7374 1.5818 0.7374 c 0.3323 0 0.6649 -0.0824 0.9617 -0.2385 l 4.3627 -2.2937 l 4.3627 2.2937 c 0.2967 0.156 0.6294 0.2385 0.9617 0.2385 c 0.6102 0 1.1866 -0.2687 1.5818 -0.7374 c 0.3923 -0.4652 0.558 -1.0772 0.4545 -1.6792 l -0.833 -4.8581 l 3.5297 -3.4405 c 0.2882 -0.2811 0.4869 -0.6354 0.5747 -1.0249 c 0.0814 -0.3614 0.0633 -0.7392 -0.0515 -1.0932 C 21.1647 7.7723 20.9568 7.456 20.6789 7.2115 z M 19.6942 9.1541 L 15.7959 12.9539 c -0.1283 0.1247 -0.1866 0.3049 -0.1564 0.4812 l 0.9201 5.3653 c 0.0604 0.3515 -0.2189 0.6369 -0.5359 0.6369 c -0.0835 0 -0.1699 -0.0199 -0.253 -0.0636 l -4.8183 -2.5332 c -0.0793 -0.0416 -0.1663 -0.0625 -0.253 -0.0625 s -0.1738 0.021 -0.253 0.0625 l -4.8183 2.5332 c -0.0832 0.0437 -0.1695 0.0636 -0.253 0.0636 c -0.317 0 -0.596 -0.2854 -0.5359 -0.6369 l 0.9201 -5.3653 c 0.0302 -0.1763 -0.0281 -0.3565 -0.1564 -0.4812 L 1.7051 9.1541 c -0.3227 -0.3145 -0.1446 -0.8625 0.3014 -0.9276 l 5.387 -0.7829 c 0.177 -0.0256 0.3302 -0.1368 0.4094 -0.2975 l 2.4092 -4.8816 c 0.0999 -0.2022 0.2936 -0.3031 0.4876 -0.3031 c 0.194 0 0.3877 0.1009 0.4876 0.3031 l 2.4092 4.8816 c 0.0793 0.1603 0.2324 0.2719 0.4094 0.2975 l 5.387 0.7829 C 19.8388 8.2915 20.0168 8.8396 19.6942 9.1541 z"); //Set path's data
	path_1.setAttribute("stroke", "#5f6368");
	path_1.setAttribute("stroke-width", "0.5");

	if (shouldAnimate) {
		path_1.appendChild(createFavIconAnimation());
	}

	svg.appendChild(path_1);
	svg.classList.add(ICON_SVG_CLASS);
	return svg;
}

function createFavIconAnimation() {
	let favIconAnimation = document.createElementNS("http://www.w3.org/2000/svg", 'animateTransform');
	favIconAnimation.setAttribute("attributeType","XML"); 
	favIconAnimation.setAttribute("attributeName","transform");
	favIconAnimation.setAttribute("type","rotate");
	favIconAnimation.setAttribute("from","0 11 11");
	favIconAnimation.setAttribute("to","360 11 11");
	favIconAnimation.setAttribute("begin","indefinite");
	favIconAnimation.setAttribute("dur","1s"); 
	return favIconAnimation;
}

function getTextDate(favContainer) {
    let parentContainer = getTextParentContainer(favContainer);
    let datetime = new Date(parentContainer.querySelector('[jsname=' + MSG_DATE_JSNAME +']').getAttribute('data-absolute-timestamp') * 1);
    return datetime.toLocaleString("es-AR");
}

function addFavClickHandler(favContainer) {
    favContainer.onclick = () => {
		let quotedText = getTextToSaveAsFav(favContainer);
        let author = getTextAuthor(favContainer);
		let datetime = getTextDate(favContainer);
		let msgObject = {
			"author": author,
			"datetime": datetime,
			"quotedText": quotedText,
		};
		addFavMsg(msgObject);
		favContainer.querySelector('path').firstElementChild.beginElement();
    };
}

function addFavMsg(msgObject) {
	let roomId = getCurrentRoomId();
	let favMsgs = getFavStorage();
	favMsgs[roomId] ? favMsgs[roomId].push(msgObject) : favMsgs[roomId] = [msgObject];
    saveFavStorage(favMsgs);
}

///////////////////////////////////////////////

init();
