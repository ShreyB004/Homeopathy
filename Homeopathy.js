const medicineSearch = document.getElementById("medicineSearch");

const allMedicinesListsDiv = document.getElementById("allMedicinesLists");
const topNavBtn = document.getElementById("topNavButton");
const allList = document.getElementById("allList");

const boxesHolder = document.getElementById("boxHolder");

const boxModal = document.getElementById("modalBox");
const orderedList = document.getElementById("orderedList");

const medicineSections = document.querySelectorAll(".medicine-section");
const tabButtons = document.querySelectorAll(".bottom-nav-btns");

const maxBoxes = 8;

const medicineBox = {

	'MedicineBox-1': ["COLCHICUM", "ACONITE NAP", "APIS MEL", "CAPSICUM", "STAPHYSAGRIA", "ACONITE - N", "RHUS TOX", "HYPERICUM", "ARNICA", "IPECAC", "ALLIUM CEPA"],

	'MedicineBox-2': ["TABACUM", "NUX VOM", "PHOSPHORUS", "GUAICUM CM", "KALI PHOS", "NAJA", "EUPHRASIA", "ARUNM MET", "ARS ALB", "EUPHRASIA OFF", "CARBO VEG", "LITHIUM CARB", "SILICEA", "LEDUM PAL", "SLONINE", "ARALIA RACEMOSA", "NAT MUR"],

	'MedicineBox-3': ["CACTUS", "BELLADONNA", "ARUNDO MAVRI", "DROSERA", "ARS ALB", "STANNUM MET", "SENEGA", "RUMAX C", "ALLUM SAT", "ANTIM FUR", "CINNA MAR", "BARYTA MUR", "BELLADONNA", "BENZA ACID", "AMYLE NRT", "KALI BITCH", "PULSATILLA", "HEPAR SULPH", "CALADIUM SEG", "SPONGIA", "NAT MUR", "CACTUS-CACTI", "CRATAEGUS OXY", "BRYONIA ALB"],

	'MedicineBox-4': ["LACHESIS", "CALC PHOS", "FERRUM MET", "URTICA URENS", "GELSEMIUM", "ABROMA AUG", "ALOE SOC", "SECALE CORN", "IGNATIA AM", "PHOS ACID", "SYZYGIUM JAMBULUM", "CONIUM MAC", "ANACARDIUM" , "ZINCUM MET", "RHODODENDRONS", "RUTA GRVO", "GRAPHITES", "CALC CARB", "CONIUM MAC", "IGNATIA MM", "AGNUS CAST", "CLEMATIS ERTICA", "MEDORRHINUM C", "TRILLIUM PENDULUM", "SABINA", "GLONOINE", "CONUM MAC", "SEPIA" , "KALI BICH", "LACHESIS", "THLASPI B.P", "BORAX", "USTILAGO", "BARYTA CARB", "CALC CARB", "GYMNEMA SYLIM", "MERC SOL", "CICUTA VIR", "SULFUR", "CROTON TIG", "MAG PHOS", "SILICEA", "STRAMONIUM", "CHAMOMILLA", "CALADIUM SEG", "HYOSCYAMUS N", "LAC CANINUM", "ROBINIA", "CAUSTICUM", "STAPHYSAGRIA", "CALC FLUOR", "MARK SOL", "CALC PHOS"],

	'MedicineBox-5': ["LYCOPODIUM", "LEGNA MINUR", "RHUS TOX   1M", "PETRO", "ARNICA", "ALUMINA SILICA", "EPIPHEGUS VIRGINIA", "HAMAMELIS VIRGINIA", "PALLADIUM", "ASAFOETICA", "AMBROSIA", "THUJA   1 CM 10 CM", "NITRIC ACID", "SULPHURIC ACID", "CAULOPHYLLUM", "CIMICIFUGA RACEMOSA", "NUPHAR LUTEUM", "RHUS TOX   10 M", "RHUS TOX   200", "CHELIDONIUM MAJUS", "CARDUUS MARIANUS"],

	'MedicineBox-6': ["NUX VOMICA", "SANG CAN", "KALI PHOS" , "PLANTAGO", "ARNICA", "FERRUM MET", "CASTOR EQ", "PLUMBUM MET", "VERBASCUM T", "EUPAT PERF", "CHENOPODIUM", "PODOPHYLLUM", "OPIUM", "MEZEREUM", "DULCAMARA", "SOLIDAGO V", "SYMPHYTUM", "ACTEA SPI", "PURRANNOVA", "STELLARIA", "TUCCA F", "URTICA", "MED RRHH UNUM CM", "MERC SOL", "KALU MUR", "AGAAPHIS NUTIM", "GUAIACUM"],

	'MedicineBox-7': ["BUFO RANA" ,"KALI IOD" ,"BRAYAT IOD" ,"CALC IOD" ,"ALFALFA" ,"BARBARIES AQ" ,"LYCOPODIUM" ,"CHININ SULPH" ,"CHENOPODIUM" ,"BERBERIS VUL" ,"ARGEN NIT" ,"CANTHARIS" ,"CHAMOMILLA" ,"SINAPIS NIG" ,"AGRAPHIS NUT" ,"BOVISTA" ,"ACID CARB" ,"HELLICA LAVA" ,"COLOCYNTHIS" ,"HEPAR SULPH" ,"BELLADONNA 1M" ,"ANTIM CRUD"],

	'MedicineBox-8': ["PASSIFLORA IN", "HYOSCYAMUS", "ABROMA RAD", "VERBASCUM T", "TABACUM", "HYDRENGEA ARB", "CHOLESTRINUM", "GNAPHALLIUM", "COLLINSONIA", "JANOSIA ASH", "KALI NIT", "CHELIDONIUM M", "ANITM CRUD", "LUPULUS", "AESCULUS HIP", "AMBRA GRE", "SARSAPARILLA", "EUCALYPTUS", "OLEUM JAC AS", "COFFEA CRUD"]
};

Object.freeze(medicineBox);


const showButton = function(btnIndex) {
   if(btnIndex < 0 || btnIndex > 1) return;

   const buttonSvg = document.querySelectorAll(".button-svg");
   
   buttonSvg.forEach((btns)=>btns.classList.remove("active-btn"));

   buttonSvg[btnIndex].classList.add("active-btn");
};

const createHorizontalLine = (boxNumber) => {
	const horizontalLine = document.createElement("div");
	horizontalLine.classList.add("space");
	horizontalLine.innerText = `Box ${boxNumber}`;
	allList.appendChild(horizontalLine);	
}

const createPills = (pillNumber, pillName, parent) => {
	const mdNameDiv = document.createElement("li");
	const smallBoxNum = document.createElement("div");
	const mdNameSpn = document.createElement("span");

	mdNameDiv.classList.add("md-name");
	smallBoxNum.classList.add("small-box-number");

	smallBoxNum.innerText = `${pillNumber}`;
	mdNameSpn.innerText = `${pillName}`;

	mdNameDiv.appendChild(smallBoxNum);
	mdNameDiv.appendChild(mdNameSpn);

	parent.appendChild(mdNameDiv);	
}

const goBack = () => {
	const getVisibleSvg = document.getElementsByClassName("active-btn");

	if(boxModal.classList.contains("visible")) boxModal.classList.remove("visible");

	if(allMedicinesLists.classList.contains("visible")) allMedicinesLists.classList.remove("visible");

	if(!boxModal.classList.contains("visible") || !allMedicinesLists.classList.contains("visible")) {
		showButton(0);
	}
};

const searchMedicinesSection = () => {
	allMedicinesLists.classList.add("visible");
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
		searchMedicines(medicineSearch.value);
	}
	if(this.value === "") showButton(0);
}

function searchMedicines(searchValue) {
	const medicineName = document.getElementsByClassName("md-name");
	const medicineNameLen = medicineName.length;

	const searchValueLowerCase = searchValue.toLowerCase();

	for(let i = 0; i < medicineNameLen; ++i) {		
		const medicineNameText = medicineName[i].innerText;
		if(medicineNameText.toLowerCase().indexOf(searchValueLowerCase) > -1) {
			medicineName[i].classList.add("show");
			medicineName[i].classList.remove("hidden");
		} else {
			medicineName[i].classList.add("hidden");
			medicineName[i].classList.remove("show");
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
			createPills((j+1), medicineBoxContainer[j], allList);
		}
	}
})();

(function() {
	for (let i = 0; i < maxBoxes; ++i) {
		boxesCls[i].setAttribute("id", `MedicineBox-${i+1}`);
		boxesCls[i].addEventListener("click", function() {
			showButton(1);
			orderedList.replaceChildren();
			
			const boxesId = boxesCls[i].id;
			const medicineBoxId = medicineBox[boxesId];

			for(let j = 0; j < medicineBoxId.length; ++j) {
				createPills((j+1), medicineBoxId[j], orderedList);
			}

			boxModal.classList.add("visible");
			alert("added");
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

const tabIds = ["medicineHomeSection", "medicineSearchSection", "medicinePatientsSection"];

tabButtons.forEach(function(btn, index){
	btn.addEventListener("click", function() {
		openTab(this, tabIds[index]);
	});
});

medicineSearch.addEventListener("focus", searchMedicinesSection)
medicineSearch.addEventListener("keyup", searchMedicinesOnKeyup);
topNavBtn.addEventListener("click", goBack);
