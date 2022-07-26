const firebaseConfig = {
  apiKey: "AIzaSyARejpzHPxZKdwuKL_JAemDB_ZKCmAJ05g",
  authDomain: "homeopathy-medicine-webapp.firebaseapp.com",
  projectId: "homeopathy-medicine-webapp",
  storageBucket: "homeopathy-medicine-webapp.appspot.com",
  messagingSenderId: "720452945745",
  appId: "1:720452945745:web:74d2ab83061133f8407570",
  measurementId: "G-E0GXS6V491"
};

const fireBaseInit = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// const cldStorage = firebase.storage();

/*const createNotifOfPatient = function(medicineName, patientName, options={}) {
	Notification.requestPermission().then(getPerm => {
		navigator.serviceWorker.register('sw.js');
		if(getPerm === 'granted') {
			navigator.serviceWorker.ready.then((reg)=>{
				reg.showNotification(`You've given ${medicineName} to ${patientName}`, options);
			})
		}
	});
};
*/

const snackBar = document.getElementById('snackBarDiv');
const snackBarIcon = document.getElementById('snackIcon');
const snackBarText = document.getElementById('snackText');

const showSnackBarNotif = function(snackType) {
	if (snackType === 'success') {
		snackBarIcon.innerText = 'done';
		snackBarText.innerText = 'Added Successfully!';
	} else if(snackType === 'error') {
		snackBarIcon.innerText = 'Close';
		snackBarText.innerText = 'Error Occured!';
	} else{
		console.error('Unexpected (snackType) in function showSnackBarNotif()');
	}
	snackBar.classList.add('show-snack');
	
	const snackBarVisibleTimer = setTimeout(function() {
		snackBar.classList.remove('show-snack');
	}, 3500);
};

String.prototype.toTitleCase = function() {
	let splitStr = this.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
	}
	return splitStr.join(' '); 
};

const captureHistory = function(nameOfPill, patientName, medicineFor, getTime) {
	const dbPath = database.ref('MedicineHistory');
	const historyObject = {
		Patient: `${patientName}`,
		PillName: `${nameOfPill}`,
		MedicinePillFor: `${medicineFor}`,
		TimeStamp: {
			Date: getTime.date,
			Time: getTime.time
		}
	};
	dbPath.push(historyObject).then(()=>{
		showSnackBarNotif('success');
	});
}

const padZero = (number) => {
	if(number === undefined || number === null) return;

	return (number < 10)?`0${number}`:number;
};

const createTimeStamp = function() {
	const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
	const weekNames = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];

	const getCurrDate = new Date();

	const currDate = getCurrDate.getDate();
	const currMonName = monthNames[getCurrDate.getMonth()];
	const currYear = getCurrDate.getFullYear();
	
	const currDayName = weekNames[getCurrDate.getDay()];
	
	let currHour = getCurrDate.getHours();
	let currMins = getCurrDate.getMinutes();

	let median = (currHour > 12)?'pm':'am';

	currHour = ((currHour > 12)?(currHour - 12):currHour);

	const createdDate = `${currDate} ${currMonName} ${currYear}`;
	const createdTime = `${padZero(currHour)} : ${padZero(currMins)} ${median}`;

	return {
		date: createdDate,
		time: createdTime
	};
};

const patientHistoryHolder = document.getElementById("patientHistoryDiv");

database.ref('MedicineHistory').on("child_added", async function(medicineSnap){
	const medicineObjValue = medicineSnap.val();
	const gPatientNameDB = await medicineObjValue.Patient;
	const gMedicineNameDB = await medicineObjValue.PillName;
	const gMedicineFor = await medicineObjValue.MedicinePillFor;
	const medicineDate = await (medicineObjValue.TimeStamp.Date).split(' ');
	const medicineTime = await (medicineObjValue.TimeStamp.Time);

	const patientNamesHistory = document.createElement('div'); 
	const patientHistoryDiv = document.createElement('div');
	const gMedicineName = document.createElement('span');
	const gArrow = document.createElement('span');
	const gPatientName = document.createElement('span');
	const gMedicineForSpan =  document.createElement('div');

	const gMedicineTimeSpan = document.createElement("time");
	const gMedicineDate = document.createElement('div');

	patientNamesHistory.classList.add('patients-name');
	patientHistoryDiv.classList.add('patients-history-details');

	gMedicineName.classList.add('given-medicine-name');
	gArrow.classList.add('material-icons', 'arrow');
	gPatientName.classList.add('given-patient-name');
	gMedicineDate.classList.add('patient-medicine-time-div');

	gMedicineName.innerText = `${gMedicineNameDB}`;
	gArrow.innerText = 'arrow_forward';
	gPatientName.innerText = `${gPatientNameDB}`;

	gMedicineForSpan.classList.add('medicine-for');

	gMedicineTimeSpan.innerText = `${medicineTime}`;

	for (let i = 0; i < medicineDate.length; ++i) {
		const dateSpans = document.createElement('span');
		dateSpans.innerText = `${medicineDate[i]}`;
		gMedicineDate.appendChild(dateSpans);
	}
	gMedicineDate.appendChild(gMedicineTimeSpan);

	if(gMedicineTimeSpan.innerText === 'undefined') gMedicineTimeSpan.remove(); 

	patientHistoryDiv.appendChild(gMedicineName);
	patientHistoryDiv.appendChild(gArrow);
	patientHistoryDiv.appendChild(gPatientName);

	if(gMedicineFor !== undefined){
		gMedicineForSpan.innerText = `${gMedicineFor}`;
	} else{
		gMedicineForSpan.innerText = 'Other';
	}

	patientHistoryDiv.appendChild(gMedicineForSpan);

	patientNamesHistory.appendChild(patientHistoryDiv);
	patientNamesHistory.appendChild(gMedicineDate);
	patientHistoryHolder.prepend(patientNamesHistory);
});

const darkModeBtn = document.getElementById("darkMode");

const dbPathDarkMode = database.ref("Theme");
const themeObj = {AppTheme: 'light'};

const setDarkMode = () => {
	const getClassOfBody = document.body.className;
	
	if(getClassOfBody === 'dark-mode') {
		themeObj.AppTheme = 'light';
		localStorage.setItem("AppTheme", "light");
	} else{
		themeObj.AppTheme = 'dark';
		localStorage.setItem("AppTheme", "dark");
	}
	dbPathDarkMode.update(themeObj);
};

const applyDarkMode = (theme) => {
	if(theme === 'dark') {
		darkModeBtn.checked = true;
		document.body.classList.add('dark-mode');
	}	else {
		darkModeBtn.checked = false;
		document.body.classList.remove('dark-mode');
	}
};

applyDarkMode(localStorage.getItem('AppTheme'));

database.ref("Theme").on("value", function(themeSnap) {
	const themeValue = themeSnap.val().AppTheme;
	applyDarkMode(themeValue);
});

darkModeBtn.addEventListener("click", setDarkMode);

const searchMedicinesInput = document.getElementById("medicineSearch");

const allMedicinesListsDiv = document.getElementById("allMedicinesLists");
const topNavBtn = document.getElementById("topNavButton");
const listSearchedMedicines = document.getElementById("searchedMedicinesList");

const boxesHolder = document.getElementById("boxHolder");

const pillsInBoxesDiv = document.getElementById("pillsInBoxes");
const pillsList = document.getElementById("pillsListInBoxes");

const addHistoryButton = document.getElementById("addHistoryBtn");
const patientNameInput = document.getElementById("patientName");
const givenMedicineFor = document.getElementById("MedicineFor");

const patientDetailsDiv = document.getElementById("captureHistoryModal");
const patientMedicineName = document.getElementById("patientMedicineName");

const medicineSections = document.querySelectorAll(".medicine-section");
const tabButtons = document.querySelectorAll(".bottom-nav-btns");

const medicineBox = {

	'MedicineBox-1': ["COLCHICUM", "ACONITE NAP", "APIS MEL", "CAPSICUM", "STAPHYSAGRIA", "ACONITE - N", "RHUS TOX", "HYPERICUM", "ARNICA", "IPECAC", "ALLIUM CEPA"],

	'MedicineBox-2': ["TABACUM", "NUX VOMICA", "PHOSPHORUS", "GUAICUM CM", "KALI PHOS", "NAJA", "EUPHRASIA", "ARUNM MET", "ARS ALB", "EUPHRASIA OFF", "CARBO VEG", "LITHIUM CARB", "SILICEA", "LEDUM PAL", "SLONINE", "ARALIA RACEMOSA", "NAT MUR"],

	'MedicineBox-3': ["CACTUS", "BELLADONNA", "ARUNDO MAVRI", "DROSERA", "ARS ALB", "STANNUM MET", "SENEGA", "RUMAX C", "ALLUM SAT", "ANTIM FUR", "CINNA MAR", "BARYTA MUR", "BELLADONNA", "BENZA ACID", "AMYLE NRT", "KALI BICH", "PULSATILLA", "HEPAR SULPH", "CALADIUM SEG", "SPONGIA", "NAT MUR", "CACTUS-CACTI", "CRATAEGUS OXY", "BRYONIA ALB"],

	'MedicineBox-4': ["LACHESIS", "CALC PHOS", "FERRUM MET", "URTICA URENS", "GELSEMIUM", "ABROMA AUG", "ALOE SOC", "SECALE CORN", "IGNATIA", "PHOS ACID", "SYZYGIUM JAMBULUM", "CONIUM MAC", "ANACARDIUM" , "ZINCUM MET", "RHODODENDRONS", "RUTA GRVO", "GRAPHITES", "CALC CARB", "CONIUM MAC", "IGNATIA MM", "AGNUS CAST", "CLEMATIS ERTICA", "MEDORRHINUM C", "TRILLIUM PENDULUM", "SABINA", "GLONOINE", "CONUM MAC", "SEPIA" , "KALI BICH", "LACHESIS", "THLASPI B.P", "BORAX", "USTILAGO", "BARYTA CARB", "CALC CARB", "GYMNEMA SYLIM", "MERC SOL", "CICUTA VIR", "SULFUR", "CROTON TIG", "MAG PHOS", "SILICEA", "STRAMONIUM", "CHAMOMILLA", "CALADIUM SEG", "HYOSCYAMUS N", "LAC CANINUM", "ROBINIA", "CAUSTICUM", "STAPHYSAGRIA", "CALC FLUOR", "MERC SOL", "CALC PHOS"],

	'MedicineBox-5': ["LYCOPODIUM", "LEGNA MINUR", "RHUS TOX   1M", "ARNICA", "PETRO", "ALUMINA SILICA", "EPIPHEGUS VIRGINIA", "HAMAMELIS VIRGINIA", "PALLADIUM", "ASAFOETICA", "AMBROSIA", "THUJA   1 CM 10 CM", "NITRIC ACID", "SULPHURIC ACID", "CAULOPHYLLUM", "CIMICIFUGA RACEMOSA", "NUPHAR LUTEUM", "RHUS TOX   10 M", "RHUS TOX   200", "CHELIDONIUM MAJUS", "CARDUUS MARIANUS", "SABADILLA", "COCCULUS INDICUS", "AMMON CARB", "CANNABIS INDICA", "STELLARIA MED", "PICRIC ACID", "BAPTISIA", "LYCOPODIUM", "AGRAPHIS NUT", "FERRUM MET", "THUJA OCC", "NUX MOSCH", "LACTIC ACID"],

	'MedicineBox-6': ["NUX VOMICA", "SANG CAN", "KALI PHOS" , "PLANTAGO", "ARNICA", "FERRUM MET", "CASTOR EQ", "PLUMBUM MET", "VERBASCUM T", "EUPAT PERF", "CHENOPODIUM", "PODOPHYLLUM", "OPIUM", "MEZEREUM", "DULCAMARA", "SOLIDAGO V", "SYMPHYTUM", "ACTEA SPI", "PURRANNOVA", "STELLARIA", "TUCCA F", "URTICA", "MED RRHH UNUM CM", "MERC SOL", "KALI MUR", "AGAAPHIS NUTIM", "GUAIACUM"],

	'MedicineBox-7': ["BUFO RANA" ,"KALI IOD" ,"BRAYAT IOD" ,"CALC IOD" ,"ALFALFA" ,"BARBARIES AQ" ,"LYCOPODIUM" ,"CHININ SULPH" ,"CHENOPODIUM" ,"BERBERIS VUL" ,"ARGEN NIT" ,"CANTHARIS" ,"CHAMOMILLA" ,"SINAPIS NIG" ,"AGRAPHIS NUT" ,"BOVISTA" ,"ACID CARB" ,"HELLICA LAVA" ,"COLOCYNTHIS" ,"HEPAR SULPH" ,"BELLADONNA 1M" ,"ANTIM CRUD"],

	'MedicineBox-8': ["PASSIFLORA IN", "HYOSCYAMUS", "ABROMA RAD", "VERBASCUM T", "TABACUM", "HYDRENGEA ARB", "CHOLESTRINUM", "GNAPHALLIUM", "COLLINSONIA", "JANOSIA ASH", "KALI NIT", "CHELIDONIUM M", "ANITM CRUD", "LUPULUS", "AESCULUS HIP", "AMBRA GRE", "SARSAPARILLA", "EUCALYPTUS", "OLEUM JAC AS", "COFFEA CRUD"]
};

const maxBoxes = Object.keys(medicineBox).length;

Object.freeze(medicineBox);

const showButton = function(btnIndex) {
   if(btnIndex < 0 || btnIndex > 1) return;

   const buttonSvg = document.querySelectorAll(".button-svg");
   
   buttonSvg.forEach((btns)=>btns.classList.remove("active-btn"));

   buttonSvg[btnIndex].classList.add("active-btn");
};

const clearText = () => {
	if (searchMedicinesInput.value) searchMedicinesInput.value = '';
};

const createHorizontalLine = (boxNumber) => {
	const horizontalLine = document.createElement("div");
	horizontalLine.classList.add("space");
	horizontalLine.innerText = `Box ${boxNumber}`;
	listSearchedMedicines.appendChild(horizontalLine);	
}
	
const createPills = (pillNumber, pillName, parent) => {
	const mdNameDiv = document.createElement("li");
	const smallBoxNum = document.createElement("div");
	const mdNameSpn = document.createElement("span");

	mdNameDiv.classList.add("md-name");
	smallBoxNum.classList.add("small-box-number");

	smallBoxNum.innerText = `${pillNumber}`;
	mdNameSpn.innerText = `${pillName}`;

	mdNameDiv.addEventListener('click', function() {
		patientDetailsDiv.classList.add("visible");
		patientMedicineName.innerText = pillName.toTitleCase();
	});

	mdNameDiv.appendChild(smallBoxNum);
	mdNameDiv.appendChild(mdNameSpn);

	parent.appendChild(mdNameDiv);	
}

const errInfoSpn = document.getElementById("errorInfoSpan");
const createHistory = () => {
	if(patientNameInput.value === '') {
		errInfoSpn.classList.add('show-error');
	} else{
		errInfoSpn.classList.remove('show-error');
		captureHistory(
			patientMedicineName.innerText,
			patientNameInput.value, 
			givenMedicineFor.value,
			createTimeStamp()
		);
		patientDetailsDiv.classList.remove("visible");
	}
};

addHistoryButton.addEventListener("click", function(){
	goBack();
	createHistory();
	errInfoSpn.classList.remove('show-error');
	patientNameInput.value = '';
	givenMedicineFor.value = '';
});

const goBack = () => {
	const getVisibleSvg = document.getElementsByClassName("active-btn");

	if(pillsInBoxesDiv.classList.contains("visible")) { 
		pillsInBoxesDiv.classList.remove("visible");
	}

	if(allMedicinesListsDiv.classList.contains("visible")) { 
		allMedicinesListsDiv.classList.remove("visible");
	}

	if(patientDetailsDiv.classList.contains("visible")) {
		patientDetailsDiv.classList.remove("visible")
	}

	if(!pillsInBoxesDiv.classList.contains("visible") 
		|| !allMedicinesListsDiv.classList.contains("visible")
		|| !patientDetailsDiv.classList.contains("visible")) {
		showButton(0);
	}
	searchMedicinesInput.value = '';
};

const searchMedicinesSection = () => {
	allMedicinesListsDiv.classList.add("visible");
	showButton(1);
}

const searchMedicinesOnKeyup = (eventKey) => {
	const eventsKeysArr = [
		"Enter", "Shift", 
		"ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft",
		"Alt", "AltGraph",
		"Control", 
		"Tab", "CapsLock", "Escape", "Meta"
	];

	Object.freeze(eventsKeysArr);

	if(!eventsKeysArr.includes(eventKey.key)) {
		searchMedicinesSection();
		linearSearch({
			QrySearch: searchMedicinesInput, 
			searchInClass: 'md-name', 
			childQuery: ['span'], 
			actionForSearchQry: true,
			letterCase: 'Upper'
		});
	}
	if(searchMedicinesInput.value === "") {
		showButton(0);
		goBack();
	}
}

function boldSearchedText(element, textToReplace) {
	element.innerHTML = element.innerHTML.replace(/<b>/g, '').replace(/<\/b>/g, '');
	element.innerHTML = element.innerHTML.replace(textToReplace, `<b>${textToReplace}</b>`);
}

function generateCssQueries(query) {
	return query.join(',');
}

function linearSearch({
	QrySearch: searchedQuery, 
	searchInClass: className, 
	childQuery: requiredQuery, 
	actionForSearchQry: searchedQueryAction,
	letterCase: caseOfletter
}) {
	const elemClasses = document.getElementsByClassName(`${className}`);
	const elemClassesLen = elemClasses.length;

	const queryInSearch = generateCssQueries(requiredQuery);

	for(let i = 0; i < elemClassesLen; ++i) {
		let searchElements = elemClasses[i].querySelector(`${requiredQuery[0]}`)

		let tempText = '';
		let value = '';

		switch (caseOfletter) {
			default: 
				tempText = searchElements.innerText;
				value = searchedQuery.value;
			case 'Upper': 
				tempText = searchElements.innerText.toLocaleUpperCase();
				value = searchedQuery.value.toLocaleUpperCase();
				break;
			case 'Lower':
				tempText = searchElements.innerText.toLocaleLowerCase();
				value = searchedQuery.value.toLocaleLowerCase();
				break;
		}

		if(searchedQueryAction === true) {
			boldSearchedText(searchElements, value);
		}

		if (tempText.indexOf(value) >= 0) {
			elemClasses[i].classList.add('show');
			elemClasses[i].classList.remove('hidden');
		} else {
			elemClasses[i].classList.add('hidden');
			elemClasses[i].classList.remove('show');
		}
	}
}

(function() {
	for (let i = 0; i < maxBoxes; ++i) {
		const medicineBox = document.createElement("div");
		const medicineBoxNumber = document.createElement("div");

		medicineBox.classList.add("boxes");
		medicineBoxNumber.classList.add("box-number");

		medicineBoxNumber.innerText = `${i+1}`;

		medicineBox.appendChild(medicineBoxNumber);
		boxesHolder.appendChild(medicineBox);
	}
})();

const boxesCls = document.getElementsByClassName("boxes");

(function() {

	for (let i = 0; i < maxBoxes; ++i) {
		const boxNum = i + 1;
		const medicineBoxStr = `MedicineBox-${boxNum}`;
		const medicineBoxContainer = medicineBox[medicineBoxStr];
		const medicineBoxContainerLen = medicineBoxContainer.length;

		createHorizontalLine(boxNum);

		for (let j = 0; j < medicineBoxContainerLen; ++j) {
			createPills((j+1), medicineBoxContainer[j], listSearchedMedicines);
		}
	}
})();

function openMedineBoxList(boxNum) {
	showButton(1);
	pillsList.innerHTML = '';
	pillsInBoxesDiv.classList.add("visible");

	pillsList.scrollTop = 0;

	const boxesId = boxesCls[boxNum].id;
	const medicineBoxId = medicineBox[boxesId];

	for(let j = 0; j < medicineBoxId.length; ++j) {
		createPills((j+1), medicineBoxId[j], pillsList);
	}
}

(function() {
	for (let i = 0; i < maxBoxes; ++i) {
		boxesCls[i].setAttribute("id", `MedicineBox-${i+1}`);
		boxesCls[i].addEventListener("click", function() {
			openMedineBoxList(i);
		});
	}
})();

const openTab = function(btnTarget, tabId) {
	const activeTab = document.getElementById(`${tabId}`);

	medicineSections.forEach((section)=>{
		section.classList.remove("active-tab");
	});
	tabButtons.forEach((tabBtn)=>{
		tabBtn.classList.remove("default-btn");
	})
	activeTab.classList.add("active-tab");
	btnTarget.classList.add("default-btn");
}

const tabIds = ["medicineHomeSection", "medicineSearchSection", "medicinePatientsSection", "userSettingsSection"];

tabButtons.forEach(function(btn, index){
	btn.addEventListener("click", function() {
		openTab(this, tabIds[index]);
	});
});

const searchHistoryInput = document.getElementById('HistorySearch');

searchHistoryInput.addEventListener('keyup', function() {
	linearSearch({
		QrySearch: searchHistoryInput, 
		searchInClass: 'patients-name', 
		childQuery: ['div.patients-history-details'], 
		actionForSearchQry: true,
		letterCase: ''
	});
});

const searchPatients = document.getElementById("patientSearch");

searchPatients.addEventListener('keyup', function() {
	linearSearch({
		QrySearch: searchPatients, 
		searchInClass: 'patients-names-lists', 
		childQuery: ['span'], 
		actionForSearchQry: true,
		letterCase: 'Lower'
	});
});

searchMedicinesInput.addEventListener("keyup", searchMedicinesOnKeyup);
topNavBtn.addEventListener("click", goBack);
