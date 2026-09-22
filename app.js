```javascript
// ========================================
// ALLERGY SCANNER
// ========================================

// Hämta HTML-element
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


// ========================================
// ALLERGENER
// ========================================

const allergyKeywords = {

    gluten: [
        "gluten",
        "vete",
        "vetemjöl",
        "wheat",
        "barley",
        "korn",
        "rye",
        "råg"
    ],

    milk: [
        "mjölk",
        "milk",
        "laktos",
        "lactose",
        "vassle",
        "whey",
        "kasein",
        "casein",
        "smör",
        "butter",
        "grädde",
        "cream",
        "ost",
        "cheese"
    ],

    egg: [
        "ägg",
        "egg",
        "albumin",
        "ovalbumin",
        "majonnäs",
        "mayonnaise"
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


// ========================================
// NAMN PÅ ALLERGENER
// ========================================

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


// ========================================
// HÄMTA VALDA ALLERGIER
// ========================================

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


// ========================================
// SPARA ALLERGIER
// ========================================

function saveAllergies() {

    const selected =
        getSelectedAllergies();

    localStorage.setItem(
        "allergyScannerAllergies",
        JSON.stringify(selected)
    );
}


// ========================================
// LADDA ALLERGIER
// ========================================

function loadAllergies() {

    const saved =
        localStorage.getItem(
            "allergyScannerAllergies"
        );

    if (!saved) {
        return;
    }

    try {

        const selected =
            JSON.parse(saved);

        const checkboxes =
            document.querySelectorAll(
                '.allergy-item input[type="checkbox"]'
            );

        checkboxes.forEach(function (checkbox) {

            checkbox.checked =
                selected.includes(
                    checkbox.value
                );

        });

    } catch (error) {

        console.error(
            "Kunde inte läsa sparade allergier.",
            error
        );
    }
}


// ========================================
// LYSSNA PÅ ALLERGIFÖRÄNDRINGAR
// ========================================

const allergyCheckboxes =
    document.querySelectorAll(
        '.allergy-item input[type="checkbox"]'
    );

allergyCheckboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        saveAllergies
    );

});


// ========================================
// SÖK PRODUKT
// ========================================

async function searchProduct() {

    const barcode =
        barcodeInput.value.trim();


    // Kontrollera att något skrivits
    if (barcode.length === 0) {

        alert(
            "Skriv in en streckkod först."
        );

        barcodeInput.focus();

        return;
    }


    // Kontrollera att det bara är siffror
    if (!/^[0-9]+$/.test(barcode)) {

        alert(
            "Streckkoden får bara innehålla siffror."
        );

        barcodeInput.focus();

        return;
    }


    // Visa resultatdelen
    productSection.classList.remove(
        "hidden"
    );


    // Visa laddning
    resultBadge.className =
        "result-badge warning";

    resultBadge.textContent =
        "🟡 Söker...";

    productName.textContent =
        "Hämtar produkt...";

    productBarcode.textContent =
        "Streckkod: " + barcode;

    resultTitle.textContent =
        "Söker produktinformation";

    resultMessage.textContent =
        "Vi kontaktar produktdatabasen.";

    ingredientsElement.textContent =
        "Hämtar...";

    allergensElement.textContent =
        "Hämtar...";


    try {

        const url =
            "https://world.openfoodfacts.org/api/v2/product/"
            + encodeURIComponent(barcode)
            + "?fields=product_name,ingredients_text,allergens";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Serverfel"
            );

        }


        const data =
            await response.json();


        // Produkten finns
        if (
            data.status === 1 &&
            data.product
        ) {

            showProduct(
                barcode,
                data.product
            );

        } else {

            showProductNotFound(
                barcode
            );

        }

    } catch (error) {

        console.error(error);

        resultBadge.className =
            "result-badge warning";

        resultBadge.textContent =
            "🟡 FEL";

        productName.textContent =
            "Kunde inte hämta produkten";

        resultTitle.textContent =
            "Något gick fel";

        resultMessage.textContent =
            "Kontrollera din internetanslutning och försök igen.";

        ingredientsElement.textContent =
            "Ingen information.";

        allergensElement.textContent =
            "Ingen information.";
    }
}


// ========================================
// VISA PRODUKT
// ========================================

function showProduct(
    barcode,
    product
) {

    const name =
        product.product_name ||
        "Okänd produkt";

    const ingredients =
        product.ingredients_text ||
        "";

    const allergens =
        product.allergens ||
        "";


    productName.textContent =
        name;

    productBarcode.textContent =
        "Streckkod: " + barcode;


    ingredientsElement.textContent =
        ingredients ||
        "Ingredienslista saknas.";

    allergensElement.textContent =
        allergens ||
        "Inga registrerade allergener.";


    analyzeProduct(
        ingredients,
        allergens
    );
}


// ========================================
// ANALYSERA PRODUKT
// ========================================

function analyzeProduct(
    ingredients,
    allergens
) {

    const selectedAllergies =
        getSelectedAllergies();


    const text =
        (
            ingredients
            + " "
            + allergens
        ).toLowerCase();


    // Ingen ingrediensinformation
    if (
        ingredients.trim().length === 0
    ) {

        resultBadge.className =
            "result-badge warning";

        resultBadge.textContent =
            "🟡 KONTROLLERA";

        resultTitle.textContent =
            "Ingrediensinformation saknas";

        resultMessage.textContent =
            "Vi kan inte bedöma produkten utan tillräcklig information. Kontrollera alltid förpackningen.";

        return;
    }


    const foundAllergies = [];


    selectedAllergies.forEach(
        function (allergy) {

            const keywords =
                allergyKeywords[allergy];


            if (!keywords) {
                return;
            }


            const found =
                keywords.some(
                    function (keyword) {

                        return text.includes(
                            keyword.toLowerCase()
                        );

                    }
                );


            if (found) {

                foundAllergies.push(
                    allergy
                );

            }

        }
    );


    // Allergen hittades
    if (
        foundAllergies.length > 0
    ) {

        const names =
            foundAllergies.map(
                function (allergy) {

                    return allergyNames[
                        allergy
                    ];

                }
            );


        resultBadge.className =
            "result-badge danger";

        resultBadge.textContent =
            "🔴 EJ LÄMPLIG";

        resultTitle.textContent =
            "Allergen hittades";

        resultMessage.textContent =
            "Vi hittade: "
            + names.join(", ")
            + ". Kontrollera alltid den aktuella förpackningen.";

        return;
    }


    // Inga matchningar
    resultBadge.className =
        "result-badge safe";

    resultBadge.textContent =
        "🟢 INGA MATCHNINGAR";

    resultTitle.textContent =
        "Inga valda allergener hittades";

    resultMessage.textContent =
        "Vi hittade inga av dina valda allergener i den tillgängliga produktinformationen. Kontrollera ändå alltid förpackningen.";
}


// ========================================
// PRODUKT HITTADES INTE
// ========================================

function showProductNotFound(
    barcode
) {

    productSection.classList.remove(
        "hidden"
    );

    productName.textContent =
        "Produkten hittades inte";

    productBarcode.textContent =
        "Streckkod: " + barcode;

    resultBadge.className =
        "result-badge warning";

    resultBadge.textContent =
        "🟡 KONTROLLERA";

    resultTitle.textContent =
        "Ingen produkt hittades";

    resultMessage.textContent =
        "Streckkoden finns inte i den produktdatabas vi använder just nu.";

    ingredientsElement.textContent =
        "Ingen information.";

    allergensElement.textContent =
        "Ingen information.";
}


// ========================================
// SÖK-KNAPPEN
// ========================================

searchButton.addEventListener(
    "click",
    function () {

        searchProduct();

    }
);


// ========================================
// ENTER PÅ TANGENTBORDET
// ========================================

barcodeInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            searchProduct();

        }

    }
);


// ========================================
// STARTA APPEN
// ========================================

loadAllergies();

console.log(
    "Allergy Scanner startad!"
);
```
