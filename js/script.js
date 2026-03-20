// script.js

// Your backend URL
const API_URL = "https://jengu-backend.onrender.com";

// PAY WITH NOKASH
async function payWithNokash() {
    const phone = document.getElementById("phone").value;
    if (!phone) {
        alert("Please enter your mobile money number.");
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
        const deviceHash = await getDeviceFingerprint();

        const res = await fetch(`${API_URL}/api/purchase/nokash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone,
                deviceHash
            })
        });

        const data = await res.json();

        if (data.success && data.downloadUrl) {
            alert("Payment successful! Download will start now.");
            window.location.href = data.downloadUrl;
        } else if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Payment failed. Please try again.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred. Check console for details.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Pay with Nokash";
    }
}

// BANDCAMP VERIFICATION
document.querySelector("a.text-jengu").addEventListener("click", async (e) => {
    e.preventDefault();

    const saleId = prompt("Enter your Bandcamp sale ID:");
    if (!saleId) return alert("Sale ID required.");

    try {
        const res = await fetch(`${API_URL}/api/verify-bandcamp?sale_id=${saleId}`, {
            method: "GET",
            credentials: "include"
        });

        if (res.redirected) {
            window.location.href = res.url; // redirect to download.html
        } else {
            const data = await res.json();
            alert(data.error || "Verification failed.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred during Bandcamp verification.");
    }
});