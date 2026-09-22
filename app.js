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

// ALLERGIER

const allergyKeywords = {
gluten: ["gluten", "vete", "vetemjöl", "wheat", "barley", "korn", "rye", "råg"],
milk: ["mjölk", "milk", "laktos", "lactose", "vassle", "whey", "kasein", "casein"],
egg: ["ägg", "egg"],
peanuts: ["jordnöt", "jordnötter", "peanut", "peanuts"],
nuts: ["nöt", "nötter", "mandel", "almond", "cashew", "pistage"],
soy: ["soja", "soy", "sojaböna"],
fish: ["fisk", "fish", "lax", "salmon", "torsk", "cod"],
shellfish: ["skaldjur", "räka", "räkor", "shrimp", "krabba", "crab"],
sesame: ["sesam", "sesame"],
mustard: ["senap", "mustard"]
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

// VALDA ALLERGIER

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
localStorage.setItem(
"allergyScannerAllergies",
JSON.stringify(getSelectedAllergies())
);
}

document.querySelectorAll(
'.allergy-item input[type="checkbox"]'
).forEach(function(box) {
box.addEventListener("change", saveAllergies);
});

// PRODUKT

function showProduct(product, barcode) {

productSection.classList.remove("hidden");

productName.textContent =
    product.product_name || "Okänd produkt";

productBarcode.textContent =
    "Streckkod: " + barcode;

const ingredients =
    product.ingredients_text || "";

const allergens =
    product.allergens || "";

ingredientsElement.textContent =
    ingredients || "Ingredienslista saknas.";

allergensElement.textContent =
    allergens || "Ingen allergeninformation.";

checkProduct(ingredients, allergens);

}

// KONTROLLERA ALLERGENER

function checkProduct(ingredients, allergens) {

const selected =
    getSelectedAllergies();

const text =
    (ingredients + " " + allergens).toLowerCase();

const found = [];

selected.forEach(function(allergy) {

    const keywords =
        allergyKeywords[allergy] || [];

    keywords.forEach(function(keyword) {

        if (
            text.includes(keyword.toLowerCase()) &&
            !found.includes(allergy)
        ) {
            found.push(allergy);
        }

    });

});


if (!ingredients.trim()) {

    resultBadge.className =
        "result-badge warning";

    resultBadge.textContent =
        "🟡 KONTROLLERA";

    resultTitle.textContent =
        "Information saknas";

    resultMessage.textContent =
        "Det finns inte tillräckligt med ingrediensinformation för att göra en automatisk kontroll.";

    return;
}


if (found.length > 0) {

    const names = found.map(function(allergy) {
        return allergyNames[allergy];
    });

    resultBadge.className =
        "result-badge danger";

    resultBadge.textContent =
        "🔴 ALLERGEN HITTAD";

    resultTitle.textContent =
        "Kontrollera produkten";

    resultMessage.textContent =
        "Följande valda allergener matchade produktinformationen: " +
        names.join(", ") +
        ".";

    return;
}


resultBadge.className =
    "result-badge safe";

resultBadge.textContent =
    "🟢 INGA MATCHNINGAR";

resultTitle.textContent =
    "Inga valda allergener hittades";

resultMessage.textContent =
    "Vi hittade inga av dina valda allergener i den tillgängliga produktinformationen.";

}

// SÖK

async function searchProduct() {

const barcode =
    barcodeInput.value.trim();


if (!barcode) {

    alert("Skriv in en streckkod först.");

    barcodeInput.focus();

    return;
}


if (!/^[0-9]+$/.test(barcode)) {

    alert(
        "Streckkoden får bara innehålla siffror."
    );

    return;
}


productSection.classList.remove("hidden");

resultBadge.className =
    "result-badge warning";

resultBadge.textContent =
    "🟡 SÖKER...";

productName.textContent =
    "Söker produkt...";

productBarcode.textContent =
    "Streckkod: " + barcode;

resultTitle.textContent =
    "Hämtar information";

resultMessage.textContent =
    "Vänta lite...";


try {

    const response = await fetch(
        "https://world.openfoodfacts.org/api/v2/product/" +
        encodeURIComponent(barcode) +
        "?fields=product_name,ingredients_text,allergens"
    );


    if (!response.ok) {
        throw new Error("Nätverksfel");
    }


    const data =
        await response.json();


    if (
        data.status === 1 &&
        data.product
    ) {

        showProduct(
            data.product,
            barcode
        );

    } else {

        productName.textContent =
            "Produkten hittades inte";

        resultBadge.className =
            "result-badge warning";

        resultBadge.textContent =
            "🟡 EJ HITTAD";

        resultTitle.textContent =
            "Ingen produkt hittades";

        resultMessage.textContent =
            "Streckkoden finns inte i produktdatabasen.";

        ingredientsElement.textContent =
            "Ingen information.";

        allergensElement.textContent =
            "Ingen information.";
    }

} catch (error) {

    console.error(error);

    resultBadge.className =
        "result-badge warning";

    resultBadge.textContent =
        "🟡 FEL";

    resultTitle.textContent =
        "Kunde inte hämta produkten";

    resultMessage.textContent =
        "Kontrollera att du har internetanslutning och försök igen.";
}

}

// SÖK-KNAPPEN

searchButton.addEventListener(
"click",
searchProduct
);

// ENTER

barcodeInput.addEventListener(
"keydown",
function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        searchProduct();
    }

}

);

// KAMERA

const scanButton =
document.getElementById("scanButton");

const scannerSection =
document.getElementById("scannerSection");

const closeScanner =
document.getElementById("closeScanner");

const scannerVideo =
document.getElementById("scannerVideo");

const scannerStatus =
document.getElementById("scannerStatus");

let cameraStream = null;

scanButton.addEventListener(
"click",
async function() {

    scannerSection.classList.remove("hidden");

    scannerStatus.textContent =
        "Startar kameran...";


    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                },
                audio: false
            });


        scannerVideo.srcObject =
            cameraStream;

        scannerStatus.textContent =
            "Kameran är igång.";

    } catch (error) {

        console.error(error);

        scannerStatus.textContent =
            "Kunde inte starta kameran. Kontrollera kameratillståndet.";
    }

}

);

// STÄNG KAMERA

closeScanner.addEventListener(
"click",
function() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(
            function(track) {
                track.stop();
            }
        );

        cameraStream = null;
    }

    scannerVideo.srcObject = null;

    scannerSection.classList.add("hidden");
}

);

// START

console.log("Allergy Scanner fungerar!");
loadAllergies();
