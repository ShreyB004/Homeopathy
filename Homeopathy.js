
let medicineSearch = document.getElementById("medicineSearch");

let allMedicinesListsDiv = document.getElementById("allMedicinesLists");
let allList = document.getElementById("allList");
let goBackBtnList = document.getElementById("goBackList");

let boxesHolder = document.getElementById("boxHolder");

let boxModal = document.getElementById("modalBox");
let goBackBtn = document.getElementById("goBack");
let orderedList = document.getElementById("orderedList");

let boxesCls = document.getElementsByClassName("boxes");
let boxesClsLen = boxesCls.length;

let medicineBox = {

	'medicinesInBox1': ["COLCHICUM", "ACONITE NAP", "APIS MEL", "CAPSICUM", "STAPHYSAGRIA", "ACONITE - N", "RHUS TOX", "HYPERICUM", "ARNICA", "IPECAC", "ALLIUM CEPA"],

	'medicinesInBox2': ["TABACUM", "NUX VOM", "PHOSPHORUS", "GUAICUM CM", "KALI PHOS", "NAJA", "EUPHRASIA", "ARUNM MET", "ARS ALB", "EUPHRASIA OFF", "CARBO VEG", "LITHIUM CARB", "SILICEA", "LEDUM PAL", "SLONINE", "ARALIA RACEMOSA", "NAT MUR"],

	'medicinesInBox3': ["CACTUS", "BELLADONNA", "ARUNDO MAVRI", "DROSERA", "ARS / ALB", "STANNUM MET", "SENEGA", "RUMAX C", "ALLUM SAT", "ANTIM FUR", "CINNA MAR", "BARYTA MUR", "BELLADONNA", "BENZA ACID", "AMYLE NRT", "KALI BITCH", "PULSATILLA", "HEPAR SULPH", "CALADIUM SEG", "SPONGIA", "NAT MUR", "CACTUS-CACTI", "CRATAEGUS OXY", "BRYONIA ALB"],

	'medicinesInBox4': ["LACHESIS", "CALC PHOS", "FERRUM MET", "URTICA URENS", "GELSEMIUM", "ABROMA AUG", "ALOE SOC", "SECALE CORN", "IGNATIA AM", "PHOS ACID", "SYZYGIUM JAMBULUM", "CONIUM MAC", "ANACARDIUM" , "ZINCUM MET", "RHODODENDRONS", "RUTA GRVO", "GRAPHITES", "CALC CARB", "CONIUM MAC", "IGNATIA MM", "AGNUS CAST", "CLEMATIS ERTICA", "MEDORRHINUM C", "TRILLIUM PENDULUM", "SABINA", "GLONOINE", "CONUM MAC", "SEPIA" , "KALI BICH", "LACHESIS", "THLASPI B.P", "BORAX", "USTILAGO", "BARYTA CARB", "CALC CARB", "GYMNEMA SYLIM", "MERC SOL", "CICUTA VIR", "SULFUR", "CROTON TIG", "MAG PHOS", "SILICEA", "STRAMONIUM", "CHAMOMILLA", "CALADIUM SEG", "HYOSCYAMUS N", "LAC CANINUM", "ROBINIA", "CAUSTICUM", "STAPHYSAGRIA", "CALC FLUOR", "MARK SOL", "CALC PHOS"],

	'medicinesInBox5': ["LYCOPODIUM", "LEGNA MINUR", "RHUS TOX   1M", "PETRO", "ARNICA", "ALUMINUM SILICA", "EPIPHEGUS VIRGINIA", "HAMAMELIS VIRGINIA", "PALLADIUM", "ASAFOETICA", "AMBROSIA", "THUJA   1 CM 10 CM", "NITRIC ACID", "SULPHURIC ACID", "CAULOPHYLLUM", "CIMICIFUGA RACEMOSA", "NUPHAR LUTEUM", "RHUS TOX   10 M", "RHUS TOX   200", "CHELIDONIUM MAJUS", "CARDUUS MARIANUS"],

	'medicinesInBox6': ["NUX VOMICA", "SANG CAN", "KALI PHOS" , "PLANTAGO", "ARNICA", "FERRUM MET", "CASTOR EQ", "PLUMBUM MET", "VERBASCUM T", "EUPAT PERF", "CHENOPODIUM", "PODOPHYLLUM", "OPIUM", "MEZEREUM", "DULCAMARA", "SOLIDAGO V", "SYMPHYTUM", "ACTEA SPI", "PURRANNOVA", "STELLARIA", "TUCCA F", "URTICA", "MED RRHH UNUM CM", "MERC SOL", "KALU MUR", "AGAAPHIS NUTIM", "GUAIACUM"],

	'medicinesInBox7': ["BUFO RANA" ,"KALI IOD" ,"BRAYAT IOD" ,"CALC IOD" ,"ALFALFA" ,"BARBARIES AQ" ,"LYCOPODIUM" ,"CHININ SULPH" ,"CHENOPODIUM" ,"BERBERIS VUL" ,"ARGEN NIT" ,"CANTHARIS" ,"CHAMOMILLA" ,"SINAPIS NIG" ,"AGRAPHIS NUT" ,"BOVISTA" ,"ACID CARB" ,"HELLICA LAVA" ,"COLOCYNTHIS" ,"HEPAR SULPH" ,"BELLADONNA 1M" ,"ANTIM CRUD"],
};


function removeChilds(parent) {
    while(parent.firstChild){
        parent.firstChild.remove();
    }
}

function searchMedicines(searchValue) {
	let medicineName = document.getElementsByClassName("md-name");
	let medicineNameLen = medicineName.length;
	let searchValueLowerCase = searchValue.toString().toLowerCase();

	for(let i = 0; i < medicineNameLen; ++i) {
		let medicineNameText = medicineName[i].innerText.toLowerCase();
		if(medicineNameText.indexOf(searchValueLowerCase) > -1) {
			medicineName[i].classList.add("show");
			medicineName[i].classList.remove("hidden");
		} else {
			medicineName[i].classList.add("hidden");
			medicineName[i].classList.remove("show");
		}
	}
}

medicineSearch.addEventListener("keyup", function() {
	allMedicinesLists.classList.add("visible");
	searchMedicines(this.value);
});

for (let i = 0; i < boxesClsLen; ++i) {
	const medicineBoxStr = `medicinesInBox${i+1}`;
	const medicineBoxContainer = medicineBox[medicineBoxStr];
	const medicineBoxContainerLen = medicineBoxContainer.length;

	let horizontalLine = document.createElement("div");
	horizontalLine.classList.add("space");
	horizontalLine.innerText = `Box ${i+1}`;
	allList.appendChild(horizontalLine);

	for (let j = 0; j < medicineBoxContainerLen; ++j) {

		let mdName = document.createElement("div");
		let smallBoxNum = document.createElement("div");

		mdName.classList.add("md-name");
		smallBoxNum.classList.add("small-box-number");

		smallBoxNum.innerText = `${j+1}`;
		mdName.innerText = `${medicineBox[medicineBoxStr][j]}`;

		mdName.appendChild(smallBoxNum);

		allList.appendChild(mdName);
	}

}

for (let i = 0; i < boxesClsLen; ++i) {
	boxesCls[i].setAttribute("id", `medicinesInBox${i+1}`);

	boxesCls[i].addEventListener("click", function() {

		const boxesId = boxesCls[i].id;

		boxModal.classList.add("visible");
		removeChilds(orderedList);

		for(let j = 0; j < medicineBox[boxesId].length; ++j) {
			let li = document.createElement("li");

			li.innerText = `${((j+1)<10)?`0${j+1}`:j+1}. ${medicineBox[boxesId][j]}`;

			orderedList.appendChild(li);
		}
	});
}
goBackBtn.addEventListener("click", function() {
	boxModal.classList.remove("visible");
});
goBackBtnList.addEventListener("click", function() {
	allMedicinesLists.classList.remove("visible");
});
