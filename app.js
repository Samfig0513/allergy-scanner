```javascript
/* =========================================
   ALLERGY SCANNER
   Main Application
========================================= */

const scanButton = document.getElementById("scanButton");
const closeScanner = document.getElementById("closeScanner");
const scannerSection = document.getElementById("scannerSection");
const scannerVideo = document.getElementById("scannerVideo");
const scannerStatus = document.getElementById("scannerStatus");

const barcodeInput = document.getElementById("barcodeInput");
const searchButton = document.getElementById("searchButton");

const productSection = document.getElementById("productSection");
const productName = document.getElementById("productName");
const productBarcode = document.getElementById("productBarcode");

const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const ingredientsElement = document.getElementById("ingredients");
const allergensElement = document.getElementById("allergens");

let cameraStream = null;


/* =========================================
   ALLERGIES
========================================= */

const allergyKeywords = {

    gluten: [
        "gluten",
        "vete",
        "vetemjöl",
        "wheat",
        "barley",
        "korn",
        "rye",
        "råg",
        "malt"
    ],

    milk: [
        "mjölk",
        "milk",
        "lactose",
        "laktos",
        "whey",
        "vassle",
        "casein",
        "kasein",
        "butter",
        "smör",
        "cream",
        "grädde",
        "cheese",
        "ost"
    ],

    egg: [
        "ägg",
        "egg",
        "albumin",
        "ovalbumin",
        "mayonnaise",
        "majonnäs"
    ],

    peanuts: [
        "jordnöt",
        "jordnötter",
        "peanut",
        "peanuts"
    ],

    nuts: [
        "nöt",
        "nötter",
        "mandel",
        "almond",
        "hasselnöt",
        "hazelnut",
        "valnöt",
        "walnut",
        "cashew",
        "pistage",
        "pistachio"
    ],

    soy: [
        "soja",
        "soy",
        "sojaböna",
        "soybean"
    ],

    fish: [
        "fisk",
        "fish",
        "torsk",
        "cod",
        "lax",
        "salmon",
        "tonfisk",
        "tuna"
    ],

    shellfish: [
        "skaldjur",
        "shellfish",
        "räka",
        "shrimp",
        "krabba",
        "crab",
        "hummer",
        "lobster"
    ],

    sesame: [
        "sesam",
        "sesame",
        "sesamfrö",
        "sesame seed"
    ],

    mustard: [
        "senap",
        "mustard"
    ]
};


/* =========================================
   ALLERGY NAMES
========================================= */

const allergyNames = {

    gluten: "Gluten / vete",
    milk: "Mjölk",
    egg: "Ägg",
    peanuts: "Jordnötter",
    nuts: "Nötter",
    soy: "Soja",
    fish: "Fisk",
    shellfish: "Skaldjur",
    sesame: "Sesam",
    mustard: "Senap"
};


/* =========================================
   LOAD SAVED ALLERGIES
========================================= */

function loadAllergies() {

    const saved =
        localStorage.getItem("allergyScannerAllergies");

    if (!saved) {
        return;
    }

    const savedAllergies = JSON.parse(saved);

    const checkboxes =
        document.querySelectorAll(
            '.allergy-item input[type="checkbox"]'
        );

    checkboxes.forEach(function (checkbox) {

        checkbox.checked =
            savedAllergies.includes(checkbox.value);

    });
}


/* =========================================
   SAVE ALLERGIES
========================================= */

function saveAllergies() {

    const checkboxes =
        document.querySelectorAll(
            '.allergy-item input[type="checkbox"]'
        );

    const selected = [];

    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {
            selected.push(checkbox.value);
        }

    });

    localStorage.setItem(
        "allergyScannerAllergies",
        JSON.stringify(selected)
    );
}


/* =========================================
   ALLERGY CHANGE
========================================= */

document
    .querySelectorAll(
        '.allergy-item input[type="checkbox"]'
    )
    .forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            saveAllergies
        );

    });


/* =========================================
   GET SELECTED ALLERGIES
========================================= */

function getSelectedAllergies() {

    const checkboxes =
        document.querySelectorAll(
            '.allergy-item input[type="checkbox"]'
        );

    const selected = [];

    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {
            selected.push(checkbox.value);
        }

    });

    return selected;
}


/* =========================================
   SEARCH PRODUCT
========================================= */

async function searchProduct(barcode) {

    barcode = barcode.trim();

    if (!barcode) {

        alert(
            "Skriv in en streckkod först."
        );

        return;
    }

    productSection.classList.remove("hidden");

    resultBadge.className =
        "result-badge warning";

    resultBadge.textContent =
        "🟡 Söker produkt...";

    resultTitle.textContent =
        "Söker...";

    resultMessage.textContent =
        "Hämtar produktinformation.";

    ingredientsElement.textContent =
        "Hämtar...";

    allergensElement.textContent
```
