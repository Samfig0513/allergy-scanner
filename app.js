
// ALLERGY SCANNER

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


// ALLERGENER

const allergyKeywords = {
    gluten: [
        "gluten", "vete", "vetemjöl", "wheat",
        "barley", "korn", "rye", "råg"
    ],

    milk: [
        "mjölk", "milk", "laktos", "lactose",
        "vassle", "whey", "kasein", "casein",
        "smör", "butter", "grädde", "cream",
        "ost", "cheese"
    ],

    egg: [
        "ägg", "egg", "albumin", "ovalbumin",
        "majonnäs", "mayonnaise"
    ],

    peanuts: [
        "jordnöt", "jordnötter",
        "peanut", "peanuts"
    ],

    nuts: [
        "nöt", "nötter", "mandel", "almond",
        "hasselnöt", "hazelnut", "valnöt",
        "walnut", "cashew", "pistage", "pistachio"
    ],

    soy: [
        "soja", "soy", "sojaböna", "soybean"
    ],

    fish: [
        "fisk", "fish", "torsk", "cod",
        "lax", "salmon", "tonfisk", "tuna"
    ],

    shellfish: [
        "skaldjur", "shellfish", "räka",
        "shrimp", "krabba", "crab",
        "hummer", "lobster"
    ],

    sesame: [
        "sesam", "sesame", "sesamfrö",
        "sesame seed"
    ],

    mustard: [
        "senap", "mustard"
    ]
};


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


// HÄMTA VALDA ALLERGIER

function getSelectedAllergies() {
    const boxes = document.querySelectorAll(
        '.allergy-item input[type="checkbox"]'
    );

    const selected = [];

    boxes.forEach(function(box) {
        if (box.checked) {
            selected.push(box.value);
        }
    });

    return selected;
}


// SPARA ALLERGIER

function saveAllergies() {
    const selected = getSelectedAllergies();

    localStorage.setItem(
        "allergyScannerAllergies",
        JSON.stringify(selected)
    );
