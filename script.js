const steps = document.querySelectorAll(".step");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentStep = 0;

function validateStep1() {
    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const phoneInput = document.querySelector('input[type="number"]');
    const inputs = [nameInput, emailInput, phoneInput];
    const msg = document.querySelectorAll(".error-message");

    let isValid = true;
    inputs.forEach((input, index) => {
        if (input.value.trim() === "") {
            msg[index].style.display = "block";
            input.style.borderColor = "hsl(354, 84%, 57%)";
            isValid = false;
        } else {
            msg[index].style.display = "none";
            input.style.borderColor = "hsl(231, 11%, 63%)";
        }

    });
    return isValid;
}
function updateAddonPrices() {
    const yearlySelected = billingSwitch.checked;
    addonPrices.forEach(priceE1 => {
        priceE1.textContent = yearlySelected ? priceE1.dataset.yearly : priceE1.dataset.monthly;
    });
}

nextBtn.addEventListener("click", () => {
    if (currentStep === 0 && !validateStep1()) return;

    if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
        updateButtons();

        if (currentStep === 2) {
            updateAddonPrices();
        }

        if (currentStep === 3) {
            generateSummary();
        }
    } else {
        document.querySelector(".form").innerHTML = `<div class="thank-you">
        <img src = "icon-thank-you.svg"/>
        <h1>Thank You!</h1>
        <p>Thanks for confirming your subscription! we hope you have fun using our platform. If you need ever our support, please feel free to email us at supprt@loremgaming.com.</p>`
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
        updateButtons();
    }
});

function updateButtons() {
    prevBtn.style.display = currentStep > 0 ? "inline-block" : "none";
    nextBtn.textContent = currentStep === steps.length - 1 ? "Submit" : "Next Step";

    const sidebarLinks = document.querySelectorAll(".sidebar a");
    sidebarLinks.forEach((link, index) => {
        if (index === currentStep) {
            link.classList.add("active-step");
        } else {
            link.classList.remove("active-step");
        }
    });
}
updateButtons();

const billingSwitch = document.getElementById("billingSwitch");
const planCards = document.querySelectorAll(".sec");
const addonPrices = document.querySelectorAll(".check .price");

billingSwitch.addEventListener("change", () => {
    const yearlySelected = billingSwitch.checked;

    planCards.forEach(card => {
        const priceElement = card.querySelector("p");
        const offerElement = card.querySelector(".offer");

        if (yearlySelected) {
            priceElement.textContent = card.dataset.yearly;
            offerElement.textContent = "2 months free"
        } else {
            priceElement.textContent = card.dataset.monthly;
            offerElement.textContent = "";
        }
    });
    updateAddonPrices();
});


planCards.forEach(card => {
    card.addEventListener("click", () => {
        planCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
    });
});

function generateSummary() {
    const summaryContainer = document.getElementById("summary-content");
    summaryContainer.innerHTML = "";

    let total = 0;
    let billingType = billingSwitch.checked ? "yr" : "mo";

    const selectedPlan = document.querySelector(".sec.selected");
    if (selectedPlan) {
        const planName = selectedPlan.querySelector("h4").textContent;
        const planPrice = selectedPlan.querySelector("p").textContent;

        const planValue = parseInt(planPrice.replace(/[^0-9]/g, ""));
        total += planValue;

        const billingLabel = billingSwitch.checked ? "yearly" : "monthly";

        const planDiv = document.createElement("div");
        planDiv.classList.add("summary-plan");
        planDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between;  width:100%; align-items:flex-start;">
        <div style= "display: flex; flex-direction:column; font-weight: bold;">
        ${planName} (${billingLabel})
        </div>
        <div>
        <a href="#" id="change-plan" style="color:hsl(243, 100%, 62%); font-size:14px; text-decoration:underline; margin-top: 4px;">
        Change
        </a>
       </div>
       <div style="font-weight: bold; color: hsl(213, 96%, 18%);">
       ${planPrice} 
       </div>
       </div>

        `;
        summaryContainer.appendChild(planDiv);

        setTimeout(() => {
            const changeLink = document.getElementById("change-plan");
            if (changeLink) {
                changeLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    steps[currentStep].classList.remove("active");
                    currentStep = 1;
                    steps[currentStep].classList.add("active");
                    updateButtons();
                });
            }
        }, 0);
    }

    const selectedAddOns = document.querySelectorAll(".check input:checked");
    if (selectedAddOns.length > 0) {
        const addonsDiv = document.createElement("div");
        addonsDiv.classList.add("summary-addons");

        selectedAddOns.forEach(addon => {
            const addonLabel = addon.closest(".check");
            const addonName = addonLabel.querySelector("h4").textContent;
            const addonPrice = addonLabel.querySelector(".price").textContent;

            const addonValue = parseInt(addonPrice.replace(/[^0-9]/g, ""));
            total += addonValue;

            const addonRow = document.createElement("div");
            addonRow.classList.add("summary-addon-row");
            addonRow.innerHTML = `
            <span class = "addon-name">${addonName}</span>
            <span class= "addon-price">${addonPrice}</span>`;
            addonsDiv.appendChild(addonRow);
        });
        summaryContainer.appendChild(addonsDiv);
    }
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("summary-total");
    totalDiv.innerHTML = `
    <span>Total (per ${billingType === "yr" ? "year" : "month"})</span>
    <span class ="total-price">+$${total}/${billingType}</span>`;
    summaryContainer.appendChild(totalDiv);
}

const sidebarLinks = document.querySelectorAll(".sidebar a");
sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        if(currentStep === 0 && !validateStep1() && index > 0) return;

        steps[currentStep].classList.remove("active");
        currentStep = index;
        steps[currentStep].classList.add("active");
        updateButtons();

        if(currentStep === 2) updateAddonPrices();
        if(currentStep === 3) generateSummary();
    });
});