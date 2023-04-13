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

const reloadButton = document.getElementById('reloadButton');

reloadButton.addEventListener("click", function() {
	window.location.reload();
});

const captureNewPill = function(pillName, pillMeasure) {
	const dpPillsPath = database.ref('Medicines');
	const pillObject = {
		PillName: pillName.toTitleCase(),
		PillMeasure: pillMeasure.replace(/ /g, '')
	};
	dpPillsPath.push(pillObject).then(()=>{
		showSnackBarNotif('success');
		reloadButton.classList.add('show');
	})
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
	const medicineDate = await (medicineObjValue.TimeStamp.Date);
	const medicineTime = await (medicineObjValue.TimeStamp.Time);

	const patientNamesHistory = document.createElement('div'); 
	const patientHistoryDiv = document.createElement('div');
	const gMedicineName = document.createElement('span');
	const gArrow = document.createElement('span');
	const gPatientName = document.createElement('span');
	const gMedicineForSpan =  document.createElement('div');

	const gMedicineTimeSpan = document.createElement("time");
	const gMedicineDate = document.createElement('div');

	patientNamesHistory.classList.add('patients-history-captured-div');
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

	const dateSpans = document.createElement('span');
	dateSpans.innerText = `${medicineDate}`;
	gMedicineDate.appendChild(dateSpans);

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

const topNavBtn = document.getElementById("topNavButton");
const listSearchedMedicines = document.getElementById("searchedMedicinesList");

const boxesHolder = document.getElementById("boxHolder");

const pillsInBoxesDiv = document.getElementById("pillsInBoxes");
const pillsList = document.getElementById("pillsListInBoxes");

const addNewPillBtn = document.getElementById("addNewPillBtn");

const addPillBtn = document.getElementById("addPillBtn");

const addHistoryButton = document.getElementById("addHistoryBtn");
const patientNameInput = document.getElementById("patientName");
const givenMedicineFor = document.getElementById("MedicineFor");

const patientDetailsDiv = document.getElementById("captureHistoryModal");
const patientMedicineName = document.getElementById("patientMedicineName");

const pillAddDiv = document.getElementById("capturePillModal");

const medicineSections = document.querySelectorAll(".medicine-section");
const tabButtons = document.querySelectorAll(".bottom-nav-btns");

/*let dataArr = [

	'Abies Nig 1m',
	'Abroma Aug 1m',
	'Abroma Rad 1m',
	'Absinthium A Cm',
	'Acid Card 1m',
	'Acid Nit Cm',
	'Aconite N Cm',
	'Aconite Nap Cm',
	'Actea Spi 1m',
	'Aesculus Hip Cm',
	'Agnus Cast Cm',
	'Agraphis Nut 1m',
	'Agraphis Nut 1m',
	'Agraphis Nut 1m',
	'Alfalfa 1m',
	'Allium Cepa Cm',
	'Allium Sat 1m',
	'Aloe Soc cm',
	'Alumina Silic 1m',
	'Ambra Gre Cm',
	'Ambrosia A 1m',
	'Ammon Carb Cm',
	'Ammon Carb Cm',
	'Amyle Nit 1m',
	'Anacardium Cm',
	'Antim Crud 1m',
	'Antim Crud Cm',
	'Antim Tart Cm',
	'Apis Mel Cm',
	'Apocynum Can 1m',
	'Aralia RAce Cm',
	'Argen Nit 1m',
	'Arnica Mont Cm',
	'Arnica Mont Cm',
	'Arnica Mont Cm',
	'Ars Alb Cm',
	'Ars Alb Cm',
	'Ars Alv cm',
	'Arundo Mauri 1m',
	'Asafoetida 1m',
	'Asterias Rub Cm',
	'Aurm Met Cm',
	'Baptisia T Cm',
	'Baryta Carb Cm',
	'Baryta Iod 1m',
	'Baryta Mur 1m',
	'Baryta Mur Cm',
	'Baryta Mur Cm',
	'Belladonna',
	'Belladonna Cm',
	'Belladonna Cm',
	'Benz Acid Cm',
	'Berberis Vul Cm',
	'Berberris AQ 1m',
	'Borax Cm',
	'Bovista 10m',
	'Bromium 1m',
	'Bryonia Alb Cm',
	'Buf Rana Cm',
	'Cactus Gr Cm',
	'Caladium Seg Cm',
	'Caladium Seg Cm',
	'Calc Carb Cm',
	'Calc Carb Cm',
	'Calc Fluor Cm',
	'Calc Iod Cm',
	'Calc Phos Cm',
	'Calc Phos Cm',
	'Calc Phos Cm',
	'Caniharis Cm',
	'Cannabis Ind 1m',
	'Capsicum A Cm',
	'Carbo Veg Cm',
	'Carduus Mar 1m',
	'Castor Eoo 1m',
	'Caulophyllum 1m',
	'Causticum Cm',
	'Chamomilla 1m',
	'Chamomilla Cm',
	'Chelidonium Cm',
	'Chelidonium M Cm',
	'Chenopodium A 1m',
	'Chenopodium A 1m',
	'Chinin Sulph 1m',
	'Chirata 1m',
	'Cholestrinum Cm',
	'Cholestrinum Cm',
	'Cicuta Cm',
	'Cicuta Vir Cm',
	'Cimicifuga R 1cm',
	'Cinna Mur 1m',
	'Clematis Er 1m',
	'Cocculus Ind 1m',
	'Coccus Cacti Cm',
	'Coffea Crud Cm',
	'Colchicum Cm',
	'Collinsonia Cm',
	'Collinsonta Cm',
	'Colocynthis 1m',
	'Conium Mac Cm',
	'Conium Mac Cm',
	'Conium Mac Cm',
	'Crataegus Oxy 1m',
	'Croton Tig Cm',
	'Drosera R Cm',
	'Dulcamara Cm',
	'Epiphegus V 1m',
	'Eucalyptus G 1m',
	'Eupat Perf Cm',
	'Euphrasia Cm',
	'Euphrasia Off Cm',
	'Ferrum Met Cm',
	'Ferrum Met Cm',
	'Ferrum Met Cm',
	'Ferrum Phos Cm',
	'Fluor Acid Cm',
	'Gelsemium Cm',
	'Gelsemium Cm',
	'Glonine Cm',
	'Glonoine Cm',
	'Gnaphallium V Cm',
	'Graphites Cm',
	'Guaiacum Cm',
	'Guaicum Cm',
	'Gymnema Syl 1m',
	'Hamamelis V Cm',
	'Hecla Lava Cm',
	'Hepar Sulph 1m',
	'Hepar Sulph Cm',
	'Hydrengea Arb 1m',
	'Hyoscyamus N Cm',
	'Hyoscyamus N Cm',
	'Hyoscyamus N Cm',
	'Hypericum P Cm',
	'Ignatia Am Cm',
	'Ignatia Am Cm',
	'Ipecac Cm',
	'Janosia Ash 1m',
	'Kali Bich Cm',
	'Kali Bichom',
	'Kali Carb Cm',
	'Kali Iod Cm',
	'Kali Mur Cm',
	'Kali Nit 1m',
	'Kali Phos Cm',
	'Kali Phos Cm',
	'Lac Can Cm',
	'Lachesis Cm',
	'Lacmesis Cm',
	'Lactic Acid 1m',
	'Lapis Alb Cm',
	'Ledum Pal Cm',
	'Lemna Minor 1m',
	'Lithium Carb',
	'Lupulus 1m',
	'Lycopodium 1m',
	'Lycopodium Cm',
	'Lycopodium Cm',
	'Mag Phos Cm',
	'Mag Phos Cm',
	'Meddrrhinum Cm',
	'Medorrhinum Cm',
	'Merc Sol Cm',
	'Merc Sol Cm',
	'Merc Sol Cm',
	'Mezerium Cm',
	'Mur Acid Cm',
	'Nat Mur Cm',
	'Nat Mur Cm',
	'Nat Phos Cm',
	'Naza 1m',
	'Nuphur Lut 1m',
	'Nux Mosch Cm',
	'Nux Vom Cm',
	'Nux Vomica Cm',
	'Oeanantha Cro 1m',
	'Oleum Jac As 1m',
	'Opium Cm',
	'Paladium Cm',
	'Passiflora In Cm',
	'Passiflora In Cm',
	'Petroleum Cm',
	'Phos Acid 1m',
	'Phos Phorus Cm',
	'Pic Acid Cm',
	'Plantago Maj Cm',
	'Platilago 1m',
	'Plumbum Met Cm',
	'Podophyllum Cm',
	'Pulsatilia Cm',
	'Purannava 1m',
	'Ratanhia Cm',
	'Rhododendon Cm',
	'Rhus Tox 1m',
	'Rhus Tox 1m',
	'Rhus Tox 200',
	'Rhus Tox Cm',
	'Rhus Tox Cm',
	'Robinia P Cm',
	'Robinia P Cm',
	'Rubia T 1m',
	'Rumex C Cm',
	'Ruta Grva Cm',
	'Sabadilla Cm',
	'Sabina 1m',
	'Sabina Cm',
	'Sang Can Cm',
	'Sarsaparilla Cm',
	'Sarsparilla Cm',
	'Secale Cor Cm',
	'Senecio Aur 1m',
	'Senega Cm',
	'Sepia Cm',
	'Silicea Cm',
	'Silicea Cm',
	'Sinapis Nig 1m',
	'Solidago V 1m',
	'Spongia T Cm',
	'Stannum Met Cm',
	'Staphysagra Cm',
	'Staphysagria Cm',
	'Stellaria Med 1m',
	'Stellaria Med 1m',
	'Stigmata M 1m',
	'Stramonium 1cm',
	'Sulph Acid 1cm',
	'Sulphus Cm',
	'Symphytum Cm',
	'Syzygium Jam 1m',
	'Syzygium Jam Cm',
	'Tabacum Cm',
	'Tabacum N Cm',
	'Thlaspi B P 1m',
	'Thuja Occ 1m',
	'Thuja Occ 1m',
	'Thuja Occ200',
	'Thuja Occ Cm',
	'Trillium P 1m',
	'Urtica Urens Cm',
	'Verbascum T 1m',
	'Verbascum T Cm',
	'Yucca F 1m',
	'Zincum Met Cm'
];*/

/*dataArr.forEach((arr) => {
	const fullNamePath = arr.replace(/ /g, '_');

	const getNameFromPath = arr.slice(0, -3);

	const getMeasurement = arr.slice(-3).replace(' ','');

	const object = {
		PillName: getNameFromPath,
		PillMeasure: getMeasurement
	};

	database.ref('Medicines').push(object);
});
*/
const pillLoader = document.getElementById('pillLoader');
let pillNumber = 0;

const medicines = database.ref('Medicines').orderByChild("PillName");
console.log("medicines", medicines);

medicines.on("child_added", function(medicineSnap, prevChildKey){
	if (pillLoader) pillLoader.remove();

	++pillNumber;
	const getMedicines = medicineSnap.val();
	const medicinePillName = getMedicines.PillName;
	const medicinePillMeasure = getMedicines.PillMeasure;

	database.ref("Medicines").child(`${prevChildKey}`).on("value", function(prevSnap) {
		
		if(prevChildKey === null 
			|| !(medicinePillName[0] === prevSnap.val().PillName[0]) 
			|| !(medicinePillName[0].toLowerCase() === prevSnap.val().PillName[0].toLowerCase())){
			pillNumber = 1;

			const breaker = document.createElement('div');
			breaker.classList.add('horizontal-line');
			breaker.innerText = medicinePillName[0];
			listSearchedMedicines.appendChild(breaker);
		}	
	});


	const mdNameDiv = document.createElement("li");
	const smallBoxNum = document.createElement("div");
	const mdNameSpn = document.createElement("span");
	const mdMeasureSpn = document.createElement('span');

	mdNameDiv.classList.add("md-name");
	smallBoxNum.classList.add("small-box-number");
	mdNameSpn.classList.add("medicine-name");
	mdMeasureSpn.classList.add("md-measure");

	smallBoxNum.innerText = `${pillNumber}`;
	mdNameSpn.innerText = `${medicinePillName}`;
	mdMeasureSpn.innerText = `${medicinePillMeasure}`;

	mdNameDiv.addEventListener('click', function() {
		patientDetailsDiv.classList.add("visible");
		showButton(true);
		patientMedicineName.innerText = medicinePillName.toTitleCase();
	});

	mdNameDiv.appendChild(smallBoxNum);
	mdNameDiv.appendChild(mdNameSpn);
	mdNameDiv.appendChild(mdMeasureSpn);

	listSearchedMedicines.appendChild(mdNameDiv);
});
/*
setTimeout(function() {
	medicines.on('value', function() {
		sortList();	
	});
	alert('sorted');
}, 3000);*/

/*function sortList() {
  let list, i, switching, b, shouldSwitch;
  list = document.getElementById("searchedMedicinesList");
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByTagName("li");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].querySelector('span.medicine-name').innerText.toLowerCase() > b[i + 1].querySelector('span.medicine-name').innerText.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}*/

const showButton = function(showBool) {
	// if(btnIndex < 0 || btnIndex > 1) return;

	const btnIndex = (showBool === true)?1:0;

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

const errInfoSpn = document.getElementById("errorInfoSpan");
const validateHistoryInputs = () => {
	return (patientNameInput.value.trim() !== '') && (givenMedicineFor.value.trim() !== '');
};

addHistoryButton.addEventListener("click", function(){
	const isHistoryValid = validateHistoryInputs();
	if(isHistoryValid) {
		goBack();
		captureHistory(
			patientMedicineName.innerText,
			patientNameInput.value, 
			givenMedicineFor.value,
			createTimeStamp()
		);
		errInfoSpn.classList.remove('show-error');
		patientNameInput.value = '';
		givenMedicineFor.value = '';
	} else{
		errInfoSpn.classList.add('show-error');
	}

});

const pillNameInpt = document.getElementById('pillNameInpt');
const pillMeasureInpt = document.getElementById('pillMeasureInpt');
const pillErrorInfoSpan = document.getElementById("pillErrorInfoSpan");

addPillBtn.addEventListener("click", function() {
	if(pillNameInpt.value.trim() !== '' && pillMeasureInpt.value.trim() !== '') {
		goBack();
		captureNewPill(pillNameInpt.value, pillMeasureInpt.value);
		pillErrorInfoSpan.classList.remove('show-error');
		pillAddDiv.classList.remove('visible');
		pillNameInpt.value = '';
		pillMeasureInpt.value = '';
	} else{
		pillErrorInfoSpan.classList.add('show-error');
	}
});

const goBack = () => {
	const getVisibleSvg = document.getElementsByClassName("active-btn");

	if(patientDetailsDiv.classList.contains("visible")) {
		patientDetailsDiv.classList.remove("visible")
	} 

	if(pillAddDiv.classList.contains("visible")) {
		pillAddDiv.classList.remove("visible");
	}

	if(errInfoSpn.classList.contains('show-error')) {
		errInfoSpn.classList.remove('show-error');
	}

	if(!pillAddDiv.classList.contains("visible")) {
		showButton(false);
	}

	if(!patientDetailsDiv.classList.contains("visible")) {
		showButton(false);
	}

	searchMedicinesInput.value = '';
};


addNewPillBtn.addEventListener('click', function() {
	showButton(true);
	pillAddDiv.classList.add('visible');
});

const searchMedicinesOnKeyup = (eventKey) => {
	const eventsKeysArr = [
		"Enter", "Shift", 
		"ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft",
		"Alt", "AltGraph",
		"Control", 
		"Tab", "CapsLock", "Escape", "Meta"
	];

	Object.freeze(eventsKeysArr);
	
	const breakersElems = document.querySelectorAll('.horizontal-line');

	if(!eventsKeysArr.includes(eventKey.key)) {
		breakersElems.forEach(elem=>{
			elem.classList.add('hidden');
		});

		linearSearch({
			QrySearch: searchMedicinesInput, 
			searchInClass: 'md-name', 
			childQuery: ['span'], 
			actionForSearchQry: false,
			letterCase: ''
		});
	}
	if(searchMedicinesInput.value === "") {
		showButton(false);
		goBack();

		breakersElems.forEach(elem=>{
			elem.classList.remove('hidden');
		});
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

/*(function() {
	const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	for (let i = 0; i < maxBoxes; ++i) {
		const medicineBox = document.createElement("div");
		const medicineBoxNumber = document.createElement("div");

		medicineBox.classList.add("boxes");
		medicineBoxNumber.classList.add("box-number");

		medicineBoxNumber.innerText = `${alphabets[i]}`;

		medicineBox.appendChild(medicineBoxNumber);
		boxesHolder.appendChild(medicineBox);
	}
})();*/

const boxesCls = document.getElementsByClassName("boxes");

/*(function() {
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
})();*/

/*function openMedineBoxList(boxNum) {
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
})();*/

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
		searchInClass: 'patients-history-captured-div', 
		childQuery: ['div.patients-history-details'], 
		actionForSearchQry: false,
		letterCase: ''
	});
});

const searchPatients = document.getElementById("patientSearch");

searchPatients.addEventListener('keyup', function() {
	linearSearch({
		QrySearch: searchPatients, 
		searchInClass: '.patients-history-captured-divs-lists', 
		childQuery: ['span'], 
		actionForSearchQry: true,
		letterCase: 'Lower'
	});
});

searchMedicinesInput.addEventListener("keyup", searchMedicinesOnKeyup);
topNavBtn.addEventListener("click", goBack);
