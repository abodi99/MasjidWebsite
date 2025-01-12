document.addEventListener("DOMContentLoaded", async () => {
    const url = "https://cors-anywhere.herokuapp.com/https://www.islamiskaforbundet.se/wp-content/plugins/bonetider/Bonetider_Widget.php";

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": "https://www.islamiskaforbundet.se/bonetider/",
        "User-Agent": "Mozilla/5.0"
    };

    const data = new URLSearchParams({
        ifis_bonetider_widget_city: "Helsingborg, SE",
        ifis_bonetider_widget_date: new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const htmlText = await response.text();
        console.log("Raw Response:", htmlText);

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const listItems = doc.querySelectorAll("li");
        console.log("List Items:", listItems);

        if (listItems.length === 0) throw new Error("No prayer times found in response.");

        const prayers = Array.from(listItems).map(li => {
            const prayerName = li.childNodes[0].nodeValue.trim();
            const prayerTime = li.querySelector("span").textContent.trim();
            return { prayerName, prayerTime };
        });

        console.log("Parsed Prayers:", prayers);
        updatePrayerTimes(prayers);
    } catch (error) {
        console.error("Error fetching or parsing prayer times:", error);

        document.getElementById("prayer-times").innerHTML = `
            <tr><td colspan="2" class="text-center text-danger">Failed to load prayer times. Please try again later.</td></tr>
        `;
    }
});

function updatePrayerTimes(prayers) {
    const tableBody = document.getElementById("prayer-times");
    tableBody.innerHTML = "";

    prayers.forEach(prayer => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const timeCell = document.createElement("td");

        nameCell.textContent = prayer.prayerName;
        timeCell.textContent = prayer.prayerTime;

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        tableBody.appendChild(row);
    });
}
